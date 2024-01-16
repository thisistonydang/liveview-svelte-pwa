<script>
  import { onMount } from "svelte";

  export let live;

  function pushVisibilityChangeEvent(live) {
    const sessionIdKey = "sessionId";
    let sessionId = sessionStorage.getItem(sessionIdKey);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(sessionIdKey, sessionId);
    }

    live.pushEvent("visibility_change", { sessionId, visibilityState: document.visibilityState });
  }

  onMount(() => {
    pushVisibilityChangeEvent(live);
  });
</script>

<svelte:window
  on:visibilitychange={() => {
    pushVisibilityChangeEvent(live);
  }}
/>
