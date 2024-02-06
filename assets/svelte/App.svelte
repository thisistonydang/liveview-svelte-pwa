<script lang="ts">
  import { onMount } from "svelte";
  import {
    isConnected,
    requestAssetCaching,
    requestServiceWorkerVersion,
  } from "../lib/offline-svelte";
  import OfflineSvelte from "../lib/offline-svelte/OfflineSvelte.svelte";

  import config from "../../priv/static/sw.config.js";
  import { useIsConnected } from "$lib/hooks/useIsConnected";
  import { openedMenuId, urlHash } from "$stores/clientOnlyState";

  import AppInfo from "./AppInfo.svelte";
  import AppSkeleton from "./AppSkeleton.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import ClientOnlyStateManagement from "./ClientOnlyStateManagement.svelte";
  import Header from "./Header.svelte";
  import ScrollPositionRestorer from "./ScrollPositionRestorer.svelte";
  import StateManagement from "./StateManagement.svelte";
  import StickyHeader from "./StickyHeader.svelte";
  import ThemeSyncManager from "./ThemeSyncManager.svelte";
  import Toast from "./Toast.svelte";
  import TodoApp from "./TodoApp.svelte";
  import UpdateAlert from "./UpdateAlert.svelte";

  import type { Live } from "live_svelte";
  import type { UndoManager } from "yjs";

  export let live: Live | undefined;
  live;

  export let currentUserEmail: string;

  const menuClass = "menu-class";
  let serviceWorkerVersion = "";
  let isClientStateRestored = false;

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

    requestServiceWorkerVersion();
  });
</script>

<StateManagement />
<ClientOnlyStateManagement bind:isClientStateRestored />
<OfflineSvelte />
<ScrollPositionRestorer {isClientStateRestored} />
<ThemeSyncManager />

<ClickOutsideClassHandler className={menuClass} callbackFunction={() => ($openedMenuId = "")} />

{#if isClientStateRestored}
  <Toast />
  <UpdateAlert />

  {#if $urlHash === ""}
    <Header {currentUserEmail} {serviceWorkerVersion} bind:isClientStateRestored {menuClass} />
  {:else}
    <StickyHeader />
  {/if}

  {#if $urlHash === "about"}
    <AppInfo />
  {:else}
    <div class="max-w-2xl mx-auto px-2 md:p-0">
      <TodoApp {menuClass} />
    </div>
  {/if}
{:else}
  <AppSkeleton />
{/if}
