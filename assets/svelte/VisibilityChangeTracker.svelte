<script lang="ts">
  import { onMount } from "svelte";

  import type { Live } from "live_svelte";

  export let live: Live;

  function pushVisibilityChangeEvent() {
    const sessionIdKey = "sessionId";
    let sessionId = sessionStorage.getItem(sessionIdKey);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(sessionIdKey, sessionId);
    }

    live?.pushEvent("visibility_change", { sessionId, visibilityState: document.visibilityState });
  }

  onMount(() => {
    pushVisibilityChangeEvent();
  });
</script>

<svelte:window
  on:visibilitychange={() => {
    pushVisibilityChangeEvent();
  }}
/>
