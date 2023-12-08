import { handleMessage } from "./handleMessage";
import { requestOnlineStatus } from "./requestOnlineStatus";

/**
 * Initialize view swapping between live-view and dead-view.
 *
 * @param {{
 *   liveSocket: * // TODO: Add type.
 *   liveViewPath: string,
 *   fallbackPath: string,
 * }} options
 */
export function initViewSwapping({ liveSocket, ...options }) {
  // Request online status from service worker on connectivity changes.
  window.addEventListener("online", requestOnlineStatus);
  window.addEventListener("offline", requestOnlineStatus);
  liveSocket.socket.onOpen(requestOnlineStatus);
  liveSocket.socket.onClose(requestOnlineStatus);
  liveSocket.socket.onError(requestOnlineStatus);

  // Listen for messages from service worker.
  navigator.serviceWorker?.addEventListener("message", (event) =>
    handleMessage({ event, ...options }),
  );
}
