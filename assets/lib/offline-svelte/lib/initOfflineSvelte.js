import { SCROLL_POSITION_KEY } from "./constants";
import { initViewSwapping } from "./initViewSwapping";
import { registerServiceWorker } from "./registerServiceWorker";
import { requestOnlineStatus } from "./requestOnlineStatus";

/**
 * Initialize offline Svelte functionality.
 *
 * @param {*} liveSocket // TODO: Add type.
 * @param {{
 *   liveViewPath: string,
 *   deadViewPath: string,
 *   serviceWorkerPath: string,
 * }} options
 *
 * Default options:
 *  - liveViewPath: "/online",
 *  - deadViewPath: "/offline",
 *  - serviceWorkerPath: "/sw.js"
 */
export function initOfflineSvelte(liveSocket, options = {}) {
  const {
    liveViewPath = "/online",
    deadViewPath = "/offline",
    serviceWorkerPath = "/sw.js",
  } = options;

  registerServiceWorker(serviceWorkerPath);
  initViewSwapping({ liveSocket, liveViewPath, deadViewPath });

  // Request online status from service worker on startup.
  requestOnlineStatus();
}
