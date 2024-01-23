<script lang="ts">
  import { sessionCount } from "../stores/liveViewSocket";
</script>

{#if $sessionCount}
  <div id="sessions-badge" class="badge badge-xs transition-none p-2">
    {$sessionCount} Session{$sessionCount > 1 ? "s" : ""}
  </div>
{/if}
