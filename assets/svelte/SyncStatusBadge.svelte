<script lang="ts">
  import { CircleAlert, CircleCheckBig, RefreshCw } from "lucide-svelte";

  import { liveView } from "$stores/liveViewSocket";
  import { syncState } from "$stores/syncState";
  import { syncDocumentToServer } from "./StateManagement.svelte";
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
  on:click={() => syncDocumentToServer($liveView)}
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
