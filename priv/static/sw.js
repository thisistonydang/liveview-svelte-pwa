const VERSION = "2023-11-29v28";
const DEBUG = false;

const assetsToCache = [
  "/",
  "/app",
  "/assets/app.css",
  "/assets/app.js",
  "/fallback",
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
  event.waitUntil(cacheAssets());
}

/**
 * Cache assets.
 */
async function cacheAssets() {
  const cache = await caches.open(VERSION);
  await cache.addAll(assetsToCache);
  DEBUG && console.log("[Service Worker] Cached assets.");
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
  const cacheNames = await caches.keys();
  const oldCacheNames = cacheNames.filter((cacheName) => cacheName !== VERSION);
  oldCacheNames.forEach(async (cacheName) => {
    DEBUG &&
      console.log(`[Service Worker] Deleting Old Cache: VERSION ${cacheName}`);
    await caches.delete(cacheName); // TODO: Is this await necessary?
  });
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
  DEBUG && console.log("[Service Worker] Handling fetch...");
  event.respondWith(fetchRequest(event.request));
}

/**
 * Try to fetch from network and refresh cache.
 * If successful, return response. Else, return cached response.
 *
 * @param {Request} request
 */
async function fetchRequest(request) {
  // TODO: Handle log out requests.
  try {
    const response = await fetch(request);
    await cacheAssets() // TODO: Is this await necessary?
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
  const cache = await caches.open(VERSION);
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

  DEBUG && console.log("[Service Worker] No cached response. Using fallback.");
  // TODO: If no cached response, return fallback page.
  return
}

// Message _________________________________________________________________________________________

self.addEventListener("message", handleMessage);

/**
 * Handle message event.
 *
 * @param {ExtendableMessageEvent} event
 */
async function handleMessage(event) {
  DEBUG && console.log("[Service Worker] Handling message...", event.data);

  switch (event.data.type) {
    case "request_online_status":
      await handleRequestOnlineStatus(event); // TODO: Is this await necessary?
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
      isOnline: await isOnline(),
    },
  };

  event.source.postMessage(message);
}

// Helpers _________________________________________________________________________________________

/**
 * Check if the client is online.
 */
async function isOnline() {
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
