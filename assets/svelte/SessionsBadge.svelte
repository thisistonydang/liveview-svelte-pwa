<script>
  import { connectionStatus } from "../lib/offline-svelte";

  export let numSessions;
</script>

{#if numSessions && $connectionStatus === "Connected"}
  <div class="badge badge-xs">
    {numSessions} Session{numSessions > 1 ? "s" : ""}
  </div>
{/if}
