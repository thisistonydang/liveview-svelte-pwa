<script>
  import { isOnline } from "../lib/offline-svelte";
</script>

{#if $isOnline}
  <div class="badge badge-accent">Connected</div>
{:else}
  <div class="badge badge-secondary">Disconnected</div>
{/if}
