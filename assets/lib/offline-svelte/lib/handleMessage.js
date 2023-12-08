import { handleRequestOnlineStatusResponse } from "./handleRequestOnlineStatusResponse";

/**
 * Handle "message" events from service worker.
 *
 * @param {{
 *   event: MessageEvent,
 *   liveViewPath: string,
 *   deadViewPath: string,
 *   scrollPositionKey: string,
 * }} options
 */
export function handleMessage({ event, ...options }) {
  switch (event.data.type) {
    case "request_online_status":
      handleRequestOnlineStatusResponse({ event, ...options });
      break;

    default:
      console.error("Unknown message type received from service worker.", event.data);
  }
}
