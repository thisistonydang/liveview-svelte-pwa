import config from "../../../../priv/static/sw.config.js";

/**
 * Request service worker to cache assets.
 *
 * @param {string[]} assets
 */
export function requestAssetCaching(assets) {
  navigator.serviceWorker?.controller?.postMessage({
    type: config.messageTypes.REQUEST_ASSET_CACHING,
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
    type: config.messageTypes.REQUEST_ASSET_DELETION,
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
    type: config.messageTypes.REQUEST_SERVICE_WORKER_VERSION,
  });
}
