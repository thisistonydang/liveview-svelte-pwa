/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

import config from "./sw.config.js";
const { cacheName, debug, publicAssets } = config; 

// Install _________________________________________________________________________________________

sw.addEventListener("install", handleInstall);

/**
 * Handle install event.
 *
 * @param {ExtendableEvent} event
 */
function handleInstall(event) {
  debug && console.log("[Service Worker] Installed.");
  event.waitUntil(cacheAssets(publicAssets));
}

/**
 * Delete cached assets.
 * 
 * @param {string[]} assets - Array of assets to delete from cache.
 */
async function deleteCacheAssets(assets) {
  const cache = await caches.open(cacheName);
  assets.forEach(async (urlPath) => {
    await cache.delete(urlPath);
  })
  debug && console.log("[Service Worker] Deleted cached assets.", assets);
}

/**
 * Cache assets.
 * 
 * @param {string[]} assets - Array of assets to cache.
 */
async function cacheAssets(assets) {
  try {
    const cache = await caches.open(cacheName);
    await cache.addAll(assets);
    debug && console.log("[Service Worker] Cached assets.", assets);
  } catch (error) {
    console.error("[Service Worker] Unable to cache assets.", error);
  }
}

// Activate ________________________________________________________________________________________

sw.addEventListener("activate", handleActivate);

/**
 * Handle activate event.
 *
 * @param {ExtendableEvent} event
 */
function handleActivate(event) {
  debug && console.log("[Service Worker] Activated.");
  event.waitUntil(deleteOldCaches());
}

/**
 * Delete all caches except current version.
 */
async function deleteOldCaches() {
  for (const key of await caches.keys()) {
    if (key !== cacheName) {
      debug && console.log(`[Service Worker] Deleting Old Cache: VERSION ${key}`);
      await caches.delete(key);
    } 
  }
}

// Fetch ___________________________________________________________________________________________

sw.addEventListener("fetch", handleFetch);

/**
 * Handle fetch event.
 *
 * @param {FetchEvent} event
 */
function handleFetch(event) {
  if (event.request.method !== 'GET') return; // Ignore non-GET requests.
  
  // Ignore LiveReloader. Only requested in dev.
  const url = new URL(event.request.url);
  if (url.pathname === '/phoenix/live_reload/frame') return; 

  debug && console.log("[Service Worker] Handling fetch...");
  event.respondWith(respond(event.request));
}

/**
 * Respond to fetch request.
 * 
 * @param {Request} request
 * 
 * @returns {Promise<Response>}
 */
async function respond(request) {
  const cache = await caches.open(cacheName);

  // Try to fetch from network first. If successful, return response. Else, return a
  // fallback response.
  try {
    const response = await fetch(request, {
      signal: AbortSignal.timeout(2000), // Timeout to prevent excessive wait time.
    });

    // If offline, fetch can return a value that is not a Response instead of
    // throwing and the non-Response can't be passed to respondWith.
    if (!(response instanceof Response)) {
      throw new Error('Invalid response from fetch.');
    }

    return response;
  } catch (error) {
    debug && console.error(`[Service Worker] Failed to fetch (${request.url}).`, error);
    
    // Check if cached response is available after trying the network first.
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      debug && console.log("[Service Worker] Found cached response.", cachedResponse);
      return cachedResponse;
    }

    // If network is down and no cache response for the request, use a fallback response.
    debug && console.log("[Service Worker] No cached response. Using fallback response.");

    const fallbackResponse = (
      await cache.match(new Request("/offline")) ||
      new Response(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>ToDo · Offline-Enabled LiveView Svelte Demo</title>
          </head>
          <body>
            <h1>Whoops, you're currently offline...</h1>
            <p>Please try refreshing once you're connected again.</p>  
            <a href="/app">Refresh</a>
          </body>
        </html>
      `, {
        status: 503,
        headers: { "Content-Type": "text/html" }, 
      })
    )
    
    // If request is for root path, return cached /app route if available.
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return await cache.match(new Request("/app")) || fallbackResponse;
    }

    return fallbackResponse
  }
}

/**
 * Cache response.
 *
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise<void>}
 */
async function cacheResponse(request, response) {
  const cache = await caches.open(cacheName);
  // TODO: Store by request URL instead of request object?
  await cache.put(request, response); // TODO: Is this await necessary?
  debug && console.log(`[Service Worker] Cached ${request.url}`);
}

// Message _________________________________________________________________________________________

sw.addEventListener("message", handleMessage);

/**
 * Handle message event.
 *
 * @param {ExtendableMessageEvent} event
 */
function handleMessage(event) {
  debug && console.log("[Service Worker] Handling message...", event.data);

  switch (event.data.type) {
    case "request_asset_caching":
      event.waitUntil(cacheAssets(event.data.payload.assets));
      break;

    case "request_asset_deletion":
      event.waitUntil(deleteCacheAssets(event.data.payload.assets));
      break;

    case "request_skip_waiting":
      event.waitUntil(handleRequestSkipWaiting(event));
      break;

    default:
      console.error(
        "[Service Worker] Unknown message type received.",
        event.data
      );
  }
}

/**
 * Skip waiting and notify client to reload.
 * 
 * @param {ExtendableMessageEvent} event
 */
async function handleRequestSkipWaiting(event) {
  sw.skipWaiting();

  const message = {
    type: event.data.type,
  };

  event.source?.postMessage(message);
}