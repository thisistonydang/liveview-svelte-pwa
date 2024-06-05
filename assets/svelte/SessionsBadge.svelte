<script lang="ts">
  import { sessionCount } from "$stores/liveViewSocket";
  import { syncState } from "$stores/syncState";
</script>

{#if $sessionCount && $syncState === "Synced"}
  <div
    id="sessions-badge"
    title="Number of active sessions."
    class="badge badge-xs transition-none p-2"
  >
    {$sessionCount} Session{$sessionCount > 1 ? "s" : ""}
  </div>
{/if}
