import { connectionStatus } from "./connectionStatus";

/**
 * Handle "message" events from service worker.
 *
 * @param {MessageEvent} event
 */
export function handleMessage(event) {
  switch (event.data.type) {
    case "request_online_status":
      connectionStatus.set(event.data.payload.isOnline ? "Connected" : "Disconnected");
      break;

    case "request_skip_waiting":
      window.location.reload();
      break;

    default:
      console.error("Unknown message type received from service worker.", event.data);
  }
}
