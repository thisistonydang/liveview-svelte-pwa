<script lang="ts">
  import { onMount } from "svelte";
  import {
    isClientStateRestored,
    requestAssetCaching,
    requestServiceWorkerVersion,
  } from "../lib/offline-svelte";
  import OfflineSvelte from "../lib/offline-svelte/OfflineSvelte.svelte";

  import config from "../../priv/static/sw.config.js";
  import { openedMenuId, urlHash } from "../stores/clientOnlyState";
  import { serverState } from "../stores/liveViewSocket";

  import AppInfo from "./AppInfo.svelte";
  import AppSkeleton from "./AppSkeleton.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import ClientOnlyStateManagement from "./ClientOnlyStateManagement.svelte";
  import Header from "./Header.svelte";
  import StateManagement from "./StateManagement.svelte";
  import StickyHeader from "./StickyHeader.svelte";
  import Toast from "./Toast.svelte";
  import TodoApp from "./TodoApp.svelte";
  import UpdateAlert from "./UpdateAlert.svelte";

  export let live;
  live;

  export let currentUserEmail;
  export let server_state;

  const menuClass = "menu-class";

  // Setting $serverState here is required so that an initial state is available
  // when offline. This allows the initial syncServerToClient call to set the
  // initial app state ($todoItems, $todoLists, and $syncState stores) even when
  // offline.
  $serverState = server_state;

  onMount(() => {
    requestAssetCaching([...config.privateAssets, ...config.publicAssets]);
    requestServiceWorkerVersion();

    // Change URL to "/app" if it's not already. This is for the case where the service worker
    // serves the cached "/app" route when the client requests the root "/" route.
    if (window.location.pathname !== "/app") {
      history.replaceState(null, "", "/app");
    }
  });
</script>

<StateManagement />
<ClientOnlyStateManagement />
<OfflineSvelte />

<ClickOutsideClassHandler className={menuClass} callbackFunction={() => ($openedMenuId = "")} />

{#if $isClientStateRestored}
  <Toast />
  <UpdateAlert />

  {#if $urlHash === ""}
    <Header {currentUserEmail} {menuClass} />
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
