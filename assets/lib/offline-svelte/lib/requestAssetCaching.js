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
