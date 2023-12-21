<script>
  import { connectionStatus, requestOnlineStatus } from "../lib/offline-svelte";

  import RefreshingSvgIcon from "./RefreshingSvgIcon.svelte";
  import SuccessSvgIcon from "./SuccessSvgIcon.svelte";
  import WarningSvgIcon from "./WarningSvgIcon.svelte";

  export let isFallback;

  if (isFallback) {
    $connectionStatus = "Disconnected";
  }
</script>

<button
  class="badge w-32"
  class:badge-accent={$connectionStatus === "Connected"}
  class:badge-primary={$connectionStatus === "Checking"}
  class:badge-secondary={$connectionStatus === "Disconnected"}
  disabled={$connectionStatus === "Checking"}
  on:click={() => {
    $connectionStatus = "Checking";
    setTimeout(() => requestOnlineStatus(), 250);
  }}
>
  <div class="flex gap-1 items-center">
    {#if $connectionStatus === "Connected"}
      <SuccessSvgIcon />
    {:else if $connectionStatus === "Checking"}
      <RefreshingSvgIcon />
    {:else}
      <WarningSvgIcon />
    {/if}

    {$connectionStatus}
  </div>
</button>
