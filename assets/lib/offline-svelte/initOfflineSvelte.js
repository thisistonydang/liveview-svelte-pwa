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
 *   scrollPositionKey: string,
 *   serviceWorkerPath: string,
 * }} options
 *
 * Default options:
 *  - liveViewPath: "/online",
 *  - deadViewPath: "/offline",
 *  - scrollPositionKey: "scrollPosition",
 *  - serviceWorkerPath: "/sw.js"
 */
export function initOfflineSvelte(liveSocket, options = {}) {
  const {
    liveViewPath = "/online",
    deadViewPath = "/offline",
    scrollPositionKey = SCROLL_POSITION_KEY,
    serviceWorkerPath = "/sw.js",
  } = options;

  registerServiceWorker(serviceWorkerPath);
  initViewSwapping({ liveSocket, liveViewPath, deadViewPath, scrollPositionKey });

  // Request online status from service worker on startup.
  requestOnlineStatus();
}
