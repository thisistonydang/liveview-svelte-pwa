/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

const config = {
  cacheName: "v2024.06.07.3",
  debug: false,
  disableCache: false, // Set to true during dev to disable caching.
  messageTypes: {
    REQUEST_ASSET_CACHING: "request_asset_caching",
    REQUEST_ASSET_DELETION: "request_asset_deletion",
    REQUEST_SKIP_WAITING: "request_skip_waiting",
    REQUEST_SERVICE_WORKER_VERSION: "request_service_worker_version",
  },
}

const { cacheName, debug, disableCache, messageTypes } = config;

// Install _________________________________________________________________________________________

sw.addEventListener("install", handleInstall);

/**
 * Handle install event.
 */
function handleInstall() {
  debug && console.log("[Service Worker] Installed.");
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
  });
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
  // Ignore non-GET requests.
  if (event.request.method.toUpperCase() !== "GET") return;

  // Ignore requests for chrome extensions.
  if (event.request.url.startsWith("chrome-extension://")) return;

  // Ignore LiveReloader. Only requested in dev.
  const url = new URL(event.request.url);
  if (url.pathname === "/phoenix/live_reload/frame") return;
  
  // Allow bypassing service worker.
  if (url.searchParams.has("bypass_service_worker")) return;

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
  
  // Try serving from cache first for faster load times.
  if (!disableCache) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      debug && console.log("[Service Worker] Found cached response.", cachedResponse);
      return cachedResponse;
    }
  }

  // Try to fetch from network. If successful, return response. Else, return a
  // cached or fallback response.
  try {
    const response = await fetch(request, {
      // If /app is cached, timeout after 2s to avoid excessive wait time.
      signal: (await cache.match(new Request("/app"))) ? AbortSignal.timeout(2000) : null,
    });

    // If offline, fetch can return a value that is not a Response instead of
    // throwing and the non-Response can't be passed to respondWith.
    if (!(response instanceof Response)) {
      throw new Error("Invalid response from fetch.");
    }

    return response;
  } catch (error) {
    debug && console.error(`[Service Worker] Failed to fetch (${request.url}).`, error);

    // If request is for root path, redirect to /app.
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return Response.redirect("/app", 302);
    }

    // Check if cached response is available.
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      debug && console.log("[Service Worker] Found cached response.", cachedResponse);
      return cachedResponse;
    }

    // When network is down and no cached response for the request, use a fallback response.
    debug && console.log("[Service Worker] No cached response. Using fallback response.");

    return (
      (await cache.match(new Request("/offline"))) ||
      new Response(
        `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>ToDo · Offline-Enabled LiveView Svelte Demo</title>
          </head>
          <body>
            <h1>Whoops, can't connect to server...</h1>
            <p>Please check your connection or try refreshing.</p>  
            <a href="/">Refresh</a>
          </body>
        </html>
      `,
        {
          status: 503,
          headers: { "Content-Type": "text/html" },
        },
      )
    );
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
  await cache.put(request, response);
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
    case messageTypes.REQUEST_ASSET_CACHING:
      event.waitUntil(cacheAssets(event.data.payload.assets));
      break;

    case messageTypes.REQUEST_ASSET_DELETION:
      event.waitUntil(deleteCacheAssets(event.data.payload.assets));
      break;

    case messageTypes.REQUEST_SKIP_WAITING:
      event.waitUntil(handleRequestSkipWaiting(event));
      break;

    case messageTypes.REQUEST_SERVICE_WORKER_VERSION:
      const message = {
        type: event.data.type,
        payload: {
          serviceWorkerVersion: cacheName,
        },
      };

      event.source?.postMessage(message);
      break;

    default:
      console.error("[Service Worker] Unknown message type received.", event.data);
  }
}

/**
 * Skip waiting and notify client to reload.
 *
 * @param {ExtendableMessageEvent} event
 */
async function handleRequestSkipWaiting(event) {
  await sw.skipWaiting();

  const message = {
    type: event.data.type,
  };

  event.source?.postMessage(message);
}
