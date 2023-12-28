<script>
  import { onMount } from "svelte";
  import { isClientStateRestored, requestAssetCaching } from "../lib/offline-svelte";
  import OfflineSvelte from "../lib/offline-svelte/OfflineSvelte.svelte";

  import config from "../../priv/static/sw.config.js";
  import { serverState } from "../stores/liveViewSocket";
  import ClientOnlyStateManagement from "./ClientOnlyStateManagement.svelte";
  import Header from "./Header.svelte";
  import StateManagement from "./StateManagement.svelte";
  import TodoApp from "./TodoApp.svelte";
  import UpdateAlert from "./UpdateAlert.svelte";

  export let live;
  live;

  export let currentUserEmail;
  export let server_state;

  // Setting $serverState here is required so that an initial state is available
  // when offline. This allows the initial syncServerToClient call to set the
  // initial app state ($todoItems, $completedItems, and $syncState stores) even
  // when offline.
  $serverState = server_state;

  onMount(() => {
    requestAssetCaching([...config.privateAssets, ...config.publicAssets]);

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

{#if $isClientStateRestored}
  <UpdateAlert />
  <Header {currentUserEmail} />

  <div class="max-w-2xl mx-auto px-2 md:p-0">
    <TodoApp />
  </div>
{:else}
  <div class="hero min-h-screen">
    <div class="hero-content">
      <span class="loading loading-dots loading-lg"></span>
    </div>
  </div>
{/if}
