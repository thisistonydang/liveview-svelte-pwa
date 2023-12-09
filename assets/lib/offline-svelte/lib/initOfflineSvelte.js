import { initViewSwapping } from "./initViewSwapping";
import { registerServiceWorker } from "./registerServiceWorker";
import { requestOnlineStatus } from "./requestOnlineStatus";

/**
 * Initialize offline Svelte functionality.
 *
 * @param {*} liveSocket // TODO: Add type.
 * @param {{
 *   liveViewPath: string,
 *   fallbackPath: string,
 *   serviceWorkerPath: string,
 * }} options
 *
 * Default options:
 *  - liveViewPath: "/app",
 *  - fallbackPath: "/fallback",
 *  - serviceWorkerPath: "/sw.js"
 */
export function initOfflineSvelte(liveSocket, options = {}) {
  const {
    liveViewPath = "/app",
    fallbackPath = "/fallback",
    serviceWorkerPath = "/sw.js",
  } = options;

  registerServiceWorker(serviceWorkerPath);
  initViewSwapping({ liveSocket, liveViewPath, fallbackPath });

  // Request online status from service worker on startup.
  requestOnlineStatus();
}
