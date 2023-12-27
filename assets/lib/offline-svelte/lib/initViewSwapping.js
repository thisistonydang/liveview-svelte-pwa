import { checkOnlineStatus } from "./checkOnlineStatus";
import { handleMessage } from "./handleMessage";

/**
 * Initialize view swapping between live-view and dead-view.
 *
 * @param {{
 *   liveSocket: * // TODO: Add type.
 * }} options
 */
export function initViewSwapping({ liveSocket }) {
  // Request online status from service worker on connectivity changes.
  window.addEventListener("online", () => checkOnlineStatus());
  window.addEventListener("offline", () => checkOnlineStatus());
  liveSocket.socket.onOpen(() => checkOnlineStatus());
  liveSocket.socket.onClose(() => checkOnlineStatus());
  liveSocket.socket.onError(() => checkOnlineStatus());

  // Listen for messages from service worker.
  navigator.serviceWorker?.addEventListener("message", handleMessage);
}
