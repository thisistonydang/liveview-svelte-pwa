<script>
  import { onMount } from "svelte";
  import { isClientStateRestored, requestAssetCaching } from "../lib/offline-svelte";
  import OfflineSvelte from "../lib/offline-svelte/OfflineSvelte.svelte";

  import { PRIVATE_ASSETS } from "../constants";
  import ClientOnlyStateManagement from "./ClientOnlyStateManagement.svelte";
  import Header from "./Header.svelte";
  import StateManagement from "./StateManagement.svelte";
  import TodoApp from "./TodoApp.svelte";
  import UpdateAlert from "./UpdateAlert.svelte";

  export let live;
  export let currentUserEmail;
  export let isFallback = false;
  export let serverState;
  export let numSessions = undefined;

  onMount(() => {
    requestAssetCaching(PRIVATE_ASSETS);
  });
</script>

<StateManagement {live} {serverState} />
<ClientOnlyStateManagement />
<OfflineSvelte {isFallback} />

{#if $isClientStateRestored}
  <UpdateAlert />
  <Header {currentUserEmail} {live} {numSessions} />

  <div class="max-w-2xl mx-auto px-2 md:p-0">
    <TodoApp {live} />
  </div>
{:else}
  <div class="hero min-h-screen">
    <div class="hero-content">
      <span class="loading loading-dots loading-lg"></span>
    </div>
  </div>
{/if}
