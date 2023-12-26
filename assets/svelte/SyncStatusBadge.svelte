<script>
  import { checkOnlineStatus, connectionStatus } from "lib/offline-svelte";

  import { todoItems, completedItems } from "../stores/crdtState";
  import { liveView } from "../stores/liveView";
  import { syncState } from "../stores/syncState";

  import { syncClientToServer } from "./StateManagement.svelte";
  import RefreshingSvgIcon from "./RefreshingSvgIcon.svelte";
  import SuccessSvgIcon from "./SuccessSvgIcon.svelte";
  import WarningSvgIcon from "./WarningSvgIcon.svelte";

  async function checkIfSynced() {
    await checkOnlineStatus();

    // Handle clicks when online.
    if ($connectionStatus === "Connected") {
      if ($syncState === "Synced") {
        // Delay checking so that the user knows that the click was registered.
        $syncState = "Syncing";
        setTimeout(() => syncClientToServer($todoItems, $completedItems, $liveView), 250);
      } else {
        syncClientToServer($todoItems, $completedItems, $liveView);
      }
      return;
    }

    // Handle clicks when offline.
    if ($syncState === "Synced") {
      // This does nothing. It just lets the user know that the click was registered.
      $syncState = "Syncing";
      setTimeout(() => ($syncState = "Synced"), 250);
    } else {
      syncClientToServer($todoItems, $completedItems, $liveView);
    }
  }
</script>

<button
  class="badge w-28"
  class:badge-accent={$syncState === "Synced"}
  class:badge-primary={$syncState === "Syncing"}
  class:badge-secondary={$syncState === "Not Synced"}
  disabled={$syncState === "Syncing"}
  on:click={checkIfSynced}
>
  <div class="flex gap-1 items-center">
    {#if $syncState === "Synced"}
      <SuccessSvgIcon />
    {:else if $syncState === "Syncing"}
      <RefreshingSvgIcon />
    {:else}
      <WarningSvgIcon />
    {/if}

    {$syncState}
  </div>
</button>
