import config from "../../../../priv/static/sw.config.js";

export function requestAssetCaching(assets: string[]) {
  navigator.serviceWorker?.controller?.postMessage({
    type: config.messageTypes.REQUEST_ASSET_CACHING,
    payload: {
      assets,
    },
  });
}

export function requestAssetDeletion(assets: string[]) {
  navigator.serviceWorker?.controller?.postMessage({
    type: config.messageTypes.REQUEST_ASSET_DELETION,
    payload: {
      assets,
    },
  });
}

export function requestServiceWorkerVersion() {
  navigator.serviceWorker?.controller?.postMessage({
    type: config.messageTypes.REQUEST_SERVICE_WORKER_VERSION,
  });
}
