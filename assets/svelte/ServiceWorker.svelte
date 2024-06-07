<script lang="ts" context="module">
  function getAppJsAndCss() {
    const appJsScript: HTMLScriptElement = document.querySelector("script[phx-track-static]");
    const appJsUrl = new URL(appJsScript.src);
    const appJs = `${appJsUrl.pathname}${appJsUrl.search}`;

    const appCssLink: HTMLLinkElement = document.querySelector("link[phx-track-static]");
    const appCssUrl = new URL(appCssLink.href);
    const appCss = `${appCssUrl.pathname}${appCssUrl.search}`;

    return { appJs, appCss };
  }

  function requestAssetCaching(assets: string[]) {
    navigator.serviceWorker?.controller?.postMessage({
      type: "request_asset_caching",
      payload: {
        assets,
      },
    });
  }

  export function requestAssetDeletion(assets: string[]) {
    navigator.serviceWorker?.controller?.postMessage({
      type: "request_asset_deletion",
      payload: {
        assets,
      },
    });
  }

  function requestServiceWorkerVersion() {
    navigator.serviceWorker?.controller?.postMessage({
      type: "request_service_worker_version",
    });
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import { useIsConnected } from "$lib/hooks/useIsConnected";

  export let serviceWorkerVersion: string;

  onMount(() => {
    navigator.serviceWorker?.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "request_skip_waiting":
          window.location.reload();
          break;

        case "request_service_worker_version":
          serviceWorkerVersion = event.data.payload.serviceWorkerVersion;
          break;

        default:
          console.error("Unknown message type received from service worker.", event.data);
      }
    });
  });

  onMount(() => {
    useIsConnected({ timeout: 10000 }).then((isConnected) => {
      if (isConnected) {
        const { appJs, appCss } = getAppJsAndCss();
        requestAssetCaching([
          // privateAssets
          "/app",
          // publicAssets
          "/favicon.ico",
          "/android-chrome-192x192.png",
          "/android-chrome-512x512.png",
          "/apple-touch-icon.png",
          "/browserconfig.xml",
          "/favicon-16x16.png",
          "/favicon-32x32.png",
          "/mstile-150x150.png",
          "/og.png",
          "/safari-pinned-tab.svg",
          "/screenshot-narrow-light.png",
          "/screenshot-narrow-dark.png",
          "/screenshot-wide-light.png",
          "/screenshot-wide-dark.png",
          "/site.webmanifest",
          "/offline",
          // hashed app js and css
          appJs,
          appCss,
        ]);
      }
    });
  });

  onMount(() => {
    requestServiceWorkerVersion();
  });
</script>
