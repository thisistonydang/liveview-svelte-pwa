const CACHE_NAME = "2023-12-13v18";
const DEBUG = false;
const PUBLIC_ASSETS = [
  "/assets/app.css",
  "/assets/app.js",
  "/favicon.ico",
]

// Install _________________________________________________________________________________________

self.addEventListener("install", handleInstall);

/**
 * Handle install event.
 *
 * @param {ExtendableEvent} event
 */
function handleInstall(event) {
  DEBUG && console.log("[Service Worker] Installed.");
  event.waitUntil(cacheAssets(PUBLIC_ASSETS));
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
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(assets);
    DEBUG && console.log("[Service Worker] Cached assets.", assets);
  } catch (error) {
    console.error("[Service Worker] Unable to cache assets.", error);
  }
}

// Activate ________________________________________________________________________________________

self.addEventListener("activate", handleActivate);

/**
 * Handle activate event.
 *
 * @param {ExtendableEvent} event
 */
function handleActivate(event) {
  DEBUG && console.log("[Service Worker] Activated.");
  event.waitUntil(deleteOldCaches());
}

/**
 * Delete all caches except current version.
 */
async function deleteOldCaches() {
  for (const key of await caches.keys()) {
    if (key !== CACHE_NAME) {
      DEBUG && console.log(`[Service Worker] Deleting Old Cache: VERSION ${key}`);
      await caches.delete(key);
    } 
  }
}

// Fetch ___________________________________________________________________________________________

self.addEventListener("fetch", handleFetch);

/**
 * Handle fetch event.
 *
 * @param {FetchEvent} event
 * @returns {Promise<Response>}
 */
function handleFetch(event) {
  if (event.request.method !== 'GET') return; // Ignore non-GET requests.

  DEBUG && console.log("[Service Worker] Handling fetch...");
  event.respondWith(respond(event.request));
}

/**
 * Try to fetch from network. If successful, return response. Else, return cached response.
 *
 * @param {Request} request
 */
async function respond(request) {
  try {
    const response = await fetch(request);

    // If offline, fetch can return a value that is not a Response instead of
    // throwing and the non-Response can't be passed to respondWith.
    if (!(response instanceof Response)) {
      throw new Error('Invalid response from fetch.');
    }

    return response;
  } catch (error) {
    DEBUG && console.error(`[Service Worker] Failed to fetch (${request.url}).`, error);
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
  const cache = await caches.open(CACHE_NAME);
  // TODO: Store by request URL instead of request object?
  await cache.put(request, response); // TODO: Is this await necessary?
  DEBUG && console.log(`[Service Worker] Cached ${request.url}`);
}

/**
 * Return cached response if available.
 *
 * @param {Request} request
 */
async function getCachedResponse(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    DEBUG && console.log("[Service Worker] Using cached response.", cachedResponse);
    return cachedResponse;
  }

  // If no cached response, always return user to /fallback route.
  DEBUG && console.log("[Service Worker] No cached response. Using fallback.");
  return await caches.match(new Request("/fallback"));
}

// Message _________________________________________________________________________________________

self.addEventListener("message", handleMessage);

/**
 * Handle message event.
 *
 * @param {ExtendableMessageEvent} event
 */
function handleMessage(event) {
  DEBUG && console.log("[Service Worker] Handling message...", event.data);

  switch (event.data.type) {
    case "request_online_status":
      event.waitUntil(handleRequestOnlineStatus(event));
      break;

    case "request_assets_caching":
      event.waitUntil(cacheAssets(event.data.payload.assets));
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

  event.source.postMessage(message);
}

/**
 * Skip waiting and notify client to reload.
 * 
 * @param {ExtendableMessageEvent} event
 */
async function handleRequestSkipWaiting(event) {
  self.skipWaiting();

  const message = {
    type: event.data.type,
  };

  event.source.postMessage(message);
}

// Helpers _________________________________________________________________________________________

/**
 * Check if the client is online.
 */
async function checkOnlineStatus() {
  if (!self.navigator.onLine) {
    return false;
  }

  try {
    const url = new URL(self.location.origin); // Avoid CORS errors with request to your own origin.
    url.searchParams.set("rand", Date.now().toString()); // Prevents cached responses.
    const response = await fetch(url, { method: "HEAD" });

    return response.ok;
  } catch {
    return false;
  }
}
