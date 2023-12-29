<script>
  export let live;
</script>

<svelte:window
  on:beforeunload={() => {
    live.pushEvent("before_unload");
  }}
  on:visibilitychange={() => {
    live.pushEvent("visibility_change", { visibilityState: document.visibilityState });
  }}
/>
