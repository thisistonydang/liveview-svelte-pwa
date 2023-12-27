import { checkOnlineStatus } from "./checkOnlineStatus";

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
}
