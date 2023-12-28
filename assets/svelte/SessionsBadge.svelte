<script>
  import { sessionCount } from "../stores/liveViewSocket";
</script>

{#if $sessionCount}
  <div class="badge badge-xs transition-none p-2">
    {$sessionCount} Session{$sessionCount > 1 ? "s" : ""}
  </div>
{/if}
