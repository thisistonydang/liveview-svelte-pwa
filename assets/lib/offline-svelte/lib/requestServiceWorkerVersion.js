/**
 * Request service worker version.
 */
export function requestServiceWorkerVersion() {
  navigator.serviceWorker?.controller?.postMessage({
    type: "request_service_worker_version",
  });
}
