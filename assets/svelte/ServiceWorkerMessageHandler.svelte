<script lang="ts" context="module">
  import config from "../../priv/static/sw.config.js";

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
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { serviceWorkerVersion } from "$stores/serviceWorkerVersion";

  onMount(() => {
    navigator.serviceWorker?.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "request_skip_waiting":
          window.location.reload();
          break;

        case "request_service_worker_version":
          $serviceWorkerVersion = event.data.payload.serviceWorkerVersion;
          break;

        default:
          console.error("Unknown message type received from service worker.", event.data);
      }
    });
  });
</script>
