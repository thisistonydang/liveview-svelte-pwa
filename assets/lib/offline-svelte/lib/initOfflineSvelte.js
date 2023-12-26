import { LiveSocket } from "phoenix_live_view";

import { initViewSwapping } from "./initViewSwapping";
import { registerServiceWorker } from "./registerServiceWorker";

/**
 * Initialize offline Svelte functionality.
 *
 * @param {LiveSocket} liveSocket
 * @param {Object} options
 * @param {string} options.serviceWorkerPath - Default: "/sw.js"
 */
export function initOfflineSvelte(
  liveSocket,
  { serviceWorkerPath } = {
    serviceWorkerPath: "/sw.js",
  },
) {
  registerServiceWorker(serviceWorkerPath);
  initViewSwapping({ liveSocket });
}
