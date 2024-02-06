<script lang="ts" context="module">
  import config from "../../priv/static/sw.config.js";

  function requestAssetCaching(assets: string[]) {
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

  function requestServiceWorkerVersion() {
    navigator.serviceWorker?.controller?.postMessage({
      type: config.messageTypes.REQUEST_SERVICE_WORKER_VERSION,
    });
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import { useIsConnected } from "$lib/hooks/useIsConnected";
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

  onMount(() => {
    useIsConnected({ timeout: 10000 }).then((isConnected) => {
      if (isConnected) {
        const appJsScript: HTMLScriptElement = document.querySelector("script[phx-track-static]");
        const appJsUrl = new URL(appJsScript.src);
        const appJs = `${appJsUrl.pathname}${appJsUrl.search}`;

        const appCssLink: HTMLLinkElement = document.querySelector("link[phx-track-static]");
        const appCssUrl = new URL(appCssLink.href);
        const appCss = `${appCssUrl.pathname}${appCssUrl.search}`;

        requestAssetCaching([...config.privateAssets, ...config.publicAssets, appJs, appCss]);
      }
    });
  });

  onMount(() => {
    requestServiceWorkerVersion();
  });
</script>
