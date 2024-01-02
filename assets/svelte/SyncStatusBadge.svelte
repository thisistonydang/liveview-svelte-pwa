<script>
  import { todoItems, completedItems } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";
  import { syncState } from "../stores/syncState";

  import { syncClientToServer } from "./StateManagement.svelte";
  import RefreshingSvgIcon from "./RefreshingSvgIcon.svelte";
  import SuccessSvgIcon from "./SuccessSvgIcon.svelte";
  import WarningSvgIcon from "./WarningSvgIcon.svelte";

  async function checkIfSynced() {
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
  class="badge w-28 border border-neutral"
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
      <RefreshingSvgIcon className="w-3 h-3 animate-spin" />
    {:else}
      <span class="w-3 h-3"><WarningSvgIcon /></span>
    {/if}

    {$syncState}
  </div>
</button>
