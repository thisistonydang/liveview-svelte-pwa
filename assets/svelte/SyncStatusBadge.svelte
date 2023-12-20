<script>
  import { checkOnlineStatus, isOnline } from "lib/offline-svelte";

  import { todoItems, completedItems } from "../stores/crdtState";
  import { syncState } from "../stores/syncState";

  import { syncClientToServer } from "./StateManagement.svelte";
  import RefreshingSvgIcon from "./RefreshingSvgIcon.svelte";
  import SuccessSvgIcon from "./SuccessSvgIcon.svelte";
  import WarningSvgIcon from "./WarningSvgIcon.svelte";

  export let live;

  async function checkIfSynced() {
    await checkOnlineStatus();

    // Handle clicks when online.
    if ($isOnline) {
      if ($syncState === "Synced") {
        // Delay checking so that the user knows that the click was registered.
        $syncState = "Syncing";
        setTimeout(() => syncClientToServer($todoItems, $completedItems, live), 250);
      } else {
        syncClientToServer($todoItems, $completedItems, live);
      }
      return;
    }

    // Handle clicks when offline.
    if ($syncState === "Synced") {
      // This does nothing. It just lets the user know that the click was registered.
      $syncState = "Syncing";
      setTimeout(() => ($syncState = "Synced"), 250);
    } else {
      syncClientToServer($todoItems, $completedItems, live);
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
