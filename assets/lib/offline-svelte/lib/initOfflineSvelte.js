import { LiveSocket } from "phoenix_live_view";

import { initViewSwapping } from "./initViewSwapping";
import { registerServiceWorker } from "./registerServiceWorker";

/**
 * Initialize offline Svelte functionality.
 *
 * @param {LiveSocket} liveSocket
 * @param {Object} options
 * @param {string} options.liveViewPath - Default: "/app"
 * @param {string} options.fallbackPath - Default: "/fallback"
 * @param {string} options.serviceWorkerPath - Default: "/sw.js"
 */
export function initOfflineSvelte(
  liveSocket,
  { liveViewPath, fallbackPath, serviceWorkerPath } = {
    liveViewPath: "/app",
    fallbackPath: "/fallback",
    serviceWorkerPath: "/sw.js",
  },
) {
  registerServiceWorker(serviceWorkerPath);
  initViewSwapping({ liveSocket, liveViewPath, fallbackPath });
}
