/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

import config from "./sw.config.js";
const { cacheName, debug, dev, privateAssets, publicAssets } = config; 

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
  const isOnline = await checkOnlineStatus();
  if (!isOnline) return; // Don't try caching if not online.

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
 * Try to fetch from network. If successful, return response. Else, return cached response.
 *
 * @param {Request} request
 */
async function respond(request) {
  // When not in dev, try serving from cache first if available.
  if (!dev) {
    const url = new URL(request.url);
    const cache = await caches.open(cacheName);
    if ([...privateAssets, ...publicAssets].includes(url.pathname)) {
      const response = await cache.match(url.pathname);
      if (response) {
        return response;
      }
    }
  }

  try {
    const response = await fetch(request, {
      signal: AbortSignal.timeout(500), // Timeout to prevent excessive wait time.
    });

    // If offline, fetch can return a value that is not a Response instead of
    // throwing and the non-Response can't be passed to respondWith.
    if (!(response instanceof Response)) {
      throw new Error('Invalid response from fetch.');
    }

    return response;
  } catch (error) {
    debug && console.error(`[Service Worker] Failed to fetch (${request.url}).`, error);
    return await getCachedResponse(request);
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

/**
 * Return cached response if available.
 *
 * @param {Request} request
 */
async function getCachedResponse(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    debug && console.log("[Service Worker] Using cached response.", cachedResponse);
    return cachedResponse;
  }
  
  // If no cached response, show /offline fallback if available else return 503 response.
  debug && console.log("[Service Worker] No cached response. Showing /offline page if available.");
  return (
    await caches.match(new Request("/offline")) || 
    new Response("You are currently offline. Please try refreshing once you're connected again.", { 
      status: 503 
    })
  );
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

    case "request_online_status":
      event.waitUntil(handleRequestOnlineStatus(event));
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
 * Reply with message to the client with the current online status.
 *
 * @param {ExtendableMessageEvent} event
 */
async function handleRequestOnlineStatus(event) {
  const message = {
    type: event.data.type,
    payload: {
      isOnline: await checkOnlineStatus(),
    },
  };

  event.source?.postMessage(message);
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

// Helpers _________________________________________________________________________________________

/**
 * Check if the client is online.
 *
 * @param {Object} options
 * @param {number} options.timeout - Default: 500
 */
async function checkOnlineStatus({ timeout } = { timeout: 500 }) {
  if (!sw.navigator.onLine) {
    return false;
  }

  try {
    const url = new URL(sw.location.origin); // Avoid CORS errors with request to your own origin.
    url.searchParams.set("rand", Date.now().toString()); // Prevents cached responses.
    const response = await fetch(url, { 
      method: "HEAD", // HEAD request to speed up response.
      signal: AbortSignal.timeout(timeout), // Timeout to prevent excessive wait time.
    });

    return response.ok;
  } catch {
    return false;
  }
}
