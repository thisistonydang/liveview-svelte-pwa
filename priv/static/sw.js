const VERSION = "2023-11-29v28";
const DEBUG = false;

// Install _________________________________________________________________________________________

self.addEventListener("install", handleInstall);

function handleInstall() {
  DEBUG && console.log("[Service Worker] Installed.");
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
 * Try to fetch from network.
 * If successful, cache and return response. Else, use cached response if available.
 *
 * @param {Request} request
 * @returns {Promise<Response | undefined>}
 */
async function fetchRequest(request) {
  try {
    const response = await fetch(request);
    await cacheResponse(request, response.clone()); // TODO: Is this await necessary?
    return response;
  } catch (error) {
    return await getCachedResponse(request, error);
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
 * @param {Error} error
 * @returns {Promise<Response | undefined>}
 */
async function getCachedResponse(request, error) {
  const cachedResponse = await caches.match(request);
  console.error(`[Service Worker] Failed to fetch (${request.url}).`, error);
  DEBUG &&
    console.log("[Service Worker] Using cached response.", cachedResponse);
  return cachedResponse;
  // TODO: If no cached response, return offline page.
}
