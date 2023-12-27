import { checkOnlineStatus } from "./checkOnlineStatus";
import { registerServiceWorker } from "./registerServiceWorker";

/**
 * Initialize offline Svelte functionality.
 *
 * @param {*} liveSocket // TODO: Add type.
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

  // Check online status on connectivity changes.
  window.addEventListener("online", () => checkOnlineStatus());
  window.addEventListener("offline", () => checkOnlineStatus());
  liveSocket.socket.onOpen(() => checkOnlineStatus());
  liveSocket.socket.onClose(() => checkOnlineStatus());
  liveSocket.socket.onError(() => checkOnlineStatus());
}
