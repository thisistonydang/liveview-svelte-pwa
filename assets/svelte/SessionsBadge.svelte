<script>
  import { connectionStatus } from "../lib/offline-svelte";
  import { sessionCount } from "../stores/liveViewSocket";
</script>

{#if $sessionCount && $connectionStatus === "Connected"}
  <div class="badge badge-xs">
    {$sessionCount} Session{$sessionCount > 1 ? "s" : ""}
  </div>
{/if}
