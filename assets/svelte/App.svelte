<script lang="ts">
  import { openedMenuId, urlHash } from "$stores/clientOnlyState";

  import AppInfo from "./AppInfo.svelte";
  import AppSkeleton from "./AppSkeleton.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import ClientOnlyStateManagement from "./ClientOnlyStateManagement.svelte";
  import Header from "./Header.svelte";
  import ScrollPositionRestorer from "./ScrollPositionRestorer.svelte";
  import ServiceWorkerMessageHandler from "./ServiceWorkerMessageHandler.svelte";
  import StateManagement from "./StateManagement.svelte";
  import StickyHeader from "./StickyHeader.svelte";
  import ThemeSyncManager from "./ThemeSyncManager.svelte";
  import Toast from "./Toast.svelte";
  import TodoApp from "./TodoApp.svelte";
  import UndoButtons from "./UndoButtons.svelte";
  import UpdateAlert from "./UpdateAlert.svelte";

  import type { Live } from "live_svelte";
  import type { UndoManager } from "yjs";

  export let live: Live;
  live;

  export let currentUserEmail: string;

  const menuClass = "menu-class";
  let isClientStateRestored = false;
  let isSyncedToIndexedDb = false;
  let serviceWorkerVersion = "";
  let undoManager: UndoManager;
</script>

<StateManagement bind:isSyncedToIndexedDb bind:undoManager />
<ClientOnlyStateManagement bind:isClientStateRestored />
<ScrollPositionRestorer {isClientStateRestored} />
<ServiceWorkerMessageHandler bind:serviceWorkerVersion />
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
      <TodoApp {menuClass} />
    </div>

    <UndoButtons {undoManager} />
  {/if}
{:else}
  <AppSkeleton />
{/if}
