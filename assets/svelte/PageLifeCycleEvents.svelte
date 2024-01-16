<script>
  export let live;
</script>

<svelte:window
  on:visibilitychange={() => {
    live.pushEvent("visibility_change", { visibilityState: document.visibilityState });
  }}
/>
