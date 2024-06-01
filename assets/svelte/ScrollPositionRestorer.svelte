<script lang="ts">
  export let isSyncedToIndexedDb: boolean;
  export let isClientStateRestored: boolean;
  export let isScrollPositionRestored: boolean;

  const scrollPositionKey = "scrollPosition";

  let scrollX: number;
  let scrollY: number;

  function restoreScrollPosition() {
    const scrollPosition = sessionStorage.getItem(scrollPositionKey);
    if (!scrollPosition) return;

    try {
      const { x, y } = JSON.parse(scrollPosition);
      if (typeof x !== "number" || typeof y !== "number") return;

      window.scrollTo(x, y);
    } catch (error) {
      console.error("Error restoring scroll position.", error);
    }
  }

  // Restore scroll position AFTER state is restored to avoid jumping scroll position.
  $: if (isSyncedToIndexedDb && isClientStateRestored) {
    setTimeout(() => {
      restoreScrollPosition();
      isScrollPositionRestored = true;
    }, 0);
  }

  // Keep scroll position stored in sessionStorage AFTER restoring scroll position.
  $: if (isScrollPositionRestored) {
    sessionStorage.setItem(scrollPositionKey, JSON.stringify({ x: scrollX, y: scrollY }));
  }
</script>

<svelte:window bind:scrollX bind:scrollY />
