const VERSION = "2023-11-29v24";

// Install _________________________________________________________________________________________

self.addEventListener("install", handleInstall);

function handleInstall() {
  console.log("[Service Worker] Installed.");
}

// Activate ________________________________________________________________________________________

self.addEventListener("activate", handleActivate);

/**
 * Handle activate event.
 *
 * @param {ExtendableEvent} event
 */
function handleActivate(event) {
  console.log("[Service Worker] Activated.");
  event.waitUntil(deleteOldCaches());
}

/**
 * Delete all caches except current version.
 */
async function deleteOldCaches() {
  const cacheNames = await caches.keys();
  cacheNames.forEach((cacheName) => {
    if (cacheName !== VERSION) {
      console.log(`[Service Worker] Deleting Old Cache: VERSION ${cacheName}`);
      caches.delete(cacheName);
    }
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
  console.log("[Service Worker] Handling fetch...");
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
    cacheResponse(request, response);
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
  const resClone = response.clone();
  const cache = await caches.open(VERSION);
  cache.put(request, resClone);
  console.log(`[Service Worker] Cached ${request.url}`);
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
  console.log("[Service Worker] Using cached response.", cachedResponse);
  return cachedResponse;
}
