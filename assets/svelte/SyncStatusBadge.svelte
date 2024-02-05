<script lang="ts">
  import RefreshingSvgIcon from "lib/svg-icons/RefreshingSvgIcon.svelte";
  import SuccessSvgIcon from "lib/svg-icons/SuccessSvgIcon.svelte";
  import WarningSvgIcon from "lib/svg-icons/WarningSvgIcon.svelte";

  import { liveView } from "../stores/liveViewSocket";
  import { syncState } from "../stores/syncState";

  import { syncDocumentToServer } from "./StateManagement.svelte";

  async function checkIfSynced() {
    if ($syncState === "Synced") {
      // This does nothing. It just lets the user know that the click was registered.
      $syncState = "Syncing";
      setTimeout(() => ($syncState = "Synced"), 250);
    } else {
      syncDocumentToServer($liveView);
    }
  }
</script>

<button
  aria-label="Sync Status."
  title="Click to force sync."
  class="
    badge w-28 border border-neutral
    focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
  "
  class:badge-accent={$syncState === "Synced"}
  class:badge-primary={$syncState === "Syncing"}
  class:badge-secondary={$syncState === "Not Synced"}
  disabled={$syncState === "Syncing"}
  on:click={checkIfSynced}
>
  <div class="flex gap-1 items-center">
    {#if $syncState === "Synced"}
      <SuccessSvgIcon className="w-3 h-3" />
    {:else if $syncState === "Syncing"}
      <RefreshingSvgIcon className="w-3 h-3 animate-spin" />
    {:else}
      <WarningSvgIcon className="w-3 h-3" />
    {/if}

    {$syncState}
  </div>
</button>
