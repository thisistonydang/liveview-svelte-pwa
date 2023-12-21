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
