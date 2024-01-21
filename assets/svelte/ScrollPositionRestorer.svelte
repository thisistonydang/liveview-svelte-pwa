<script lang="ts">
  export let isClientStateRestored = false;

  const scrollPositionKey = "scrollPosition";

  let scrollPositionRestored = false;
  let scrollX: number;
  let scrollY: number;

  function restoreScrollPosition() {
    const scrollPosition = localStorage.getItem(scrollPositionKey);
    if (!scrollPosition) return;

    try {
      const { x, y } = JSON.parse(scrollPosition);
      if (typeof x !== "number" || typeof y !== "number") return;

      window.scrollTo(x, y);
    } catch (error) {
      console.error("Error restoring scroll position.", error);
    }
  }

  // Restore scroll position AFTER client state is restored to avoid jumping scroll position.
  $: if (isClientStateRestored) {
    setTimeout(() => {
      restoreScrollPosition();
      scrollPositionRestored = true;
    }, 0);
  }

  // Keep scroll position stored in localStorage AFTER restoring scroll position.
  $: if (scrollPositionRestored) {
    localStorage.setItem(scrollPositionKey, JSON.stringify({ x: scrollX, y: scrollY }));
  }
</script>

<svelte:window bind:scrollX bind:scrollY />
