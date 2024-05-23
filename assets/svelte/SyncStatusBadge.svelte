<script lang="ts">
  import { CircleAlert, CircleCheckBig, RefreshCw } from "lucide-svelte";

  import { syncState } from "$stores/syncState";
  import { notifyUserSyncingIsInProgress } from "./StateManagement.svelte";

  async function checkIfSynced() {
    if ($syncState === "Synced") {
      // This does nothing. It just lets the user know that the click was registered.
      $syncState = "Syncing";
      setTimeout(() => ($syncState = "Synced"), 250);
    } else {
      // Attempt syncing by reconnecting the live view socket.
      notifyUserSyncingIsInProgress();
      if (!window.liveSocket.isConnected()) {
        window.liveSocket.connect();

        setTimeout(() => {
          if (!window.liveSocket.isConnected()) {
            window.location.reload();
          }
        }, 2000);
      }
    }
  }
</script>

<button
  aria-label="Sync Status."
  title="Click to force sync."
  class="
    badge w-[113px] border border-neutral
    focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
  "
  class:badge-accent={$syncState === "Synced"}
  class:badge-primary={$syncState === "Syncing"}
  class:badge-secondary={$syncState === "Not Synced"}
  disabled={$syncState === "Syncing"}
  on:click={checkIfSynced}
>
  <div class="flex gap-[5px] items-center">
    {#if $syncState === "Synced"}
      <CircleCheckBig class="w-3 h-3" />
    {:else if $syncState === "Syncing"}
      <RefreshCw class="w-3 h-3 animate-spin" />
    {:else}
      <CircleAlert class="w-3 h-3" />
    {/if}

    {$syncState}
  </div>
</button>
