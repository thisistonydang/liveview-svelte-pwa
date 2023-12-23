const DEBUG = false;

/**
 * Register app service worker
 *
 * @param {string} serviceWorkerPath
 */
export function registerServiceWorker(serviceWorkerPath) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register(serviceWorkerPath, {
          type: "module", // Allow ES module imports in sw.
          updateViaCache: "none", // Always update sw imports from network to prevent caching issues.
        });
        DEBUG && console.log("[Service Worker] Registered.", registration);
      } catch (error) {
        console.error("[Service Worker] Registration Failed.", error);
      }
    });
  } else {
    console.error("[Service Worker] Not Supported.");
  }
}
