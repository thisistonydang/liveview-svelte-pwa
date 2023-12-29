/**
 * Request service worker to cache assets.
 *
 * @param {string[]} assets
 */
export function requestAssetCaching(assets) {
  navigator.serviceWorker?.controller?.postMessage({
    type: "request_asset_caching",
    payload: {
      assets,
    },
  });
}

/**
 * Request service worker to delete cache assets.
 *
 * @param {string[]} assets
 */
export function requestAssetDeletion(assets) {
  navigator.serviceWorker?.controller?.postMessage({
    type: "request_asset_deletion",
    payload: {
      assets,
    },
  });
}

/**
 * Request service worker version.
 */
export function requestServiceWorkerVersion() {
  navigator.serviceWorker?.controller?.postMessage({
    type: "request_service_worker_version",
  });
}
