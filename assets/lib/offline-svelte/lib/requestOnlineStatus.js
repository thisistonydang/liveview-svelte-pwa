/**
 * Request online status from service worker.
 */
export function requestOnlineStatus() {
  navigator.serviceWorker?.controller?.postMessage({
    type: "request_online_status",
  });
}
