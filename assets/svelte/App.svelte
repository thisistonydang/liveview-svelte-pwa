<script lang="ts">
  import { openedMenuId, urlHash } from "$stores/clientOnlyState";

  import AppInfo from "./AppInfo.svelte";
  import AppSkeleton from "./AppSkeleton.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import ClientOnlyStateManagement from "./ClientOnlyStateManagement.svelte";
  import Header from "./Header.svelte";
  import ScrollPositionRestorer from "./ScrollPositionRestorer.svelte";
  import ServiceWorker from "./ServiceWorker.svelte";
  import StateManagement from "./StateManagement.svelte";
  import StickyHeader from "./StickyHeader.svelte";
  import ThemeSyncManager from "./ThemeSyncManager.svelte";
  import Toast from "./Toast.svelte";
  import TodoApp from "./TodoApp.svelte";
  import UpdateAlert from "./UpdateAlert.svelte";

  import type { Live } from "live_svelte";

  export let live: Live;
  live;

  export let currentUserEmail: string;

  const menuClass = "menu-class";
  let isClientStateRestored = false;
  let isSyncedToIndexedDb = false;
  let isScrollPositionRestored = false;
  let serviceWorkerVersion: string;
</script>

<StateManagement bind:isSyncedToIndexedDb />
<ClientOnlyStateManagement bind:isClientStateRestored />
<ScrollPositionRestorer
  {isSyncedToIndexedDb}
  {isClientStateRestored}
  bind:isScrollPositionRestored
/>
<ServiceWorker bind:serviceWorkerVersion />
<ThemeSyncManager />

<ClickOutsideClassHandler className={menuClass} callbackFunction={() => ($openedMenuId = "")} />

{#if isSyncedToIndexedDb && isClientStateRestored}
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
      <TodoApp {menuClass} {isScrollPositionRestored} />
    </div>
  {/if}
{:else}
  <AppSkeleton />
{/if}
