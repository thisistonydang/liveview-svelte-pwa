<script>
  import { onMount } from "svelte";

  export let scrollPositionKey;

  let mounted;
  let scrollX;
  let scrollY;

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

  onMount(() => {
    const timeoutId = setTimeout(() => {
      restoreScrollPosition();
      mounted = true;
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  // Keep scroll position stored in localStorage.
  $: if (mounted) {
    localStorage.setItem(scrollPositionKey, JSON.stringify({ x: scrollX, y: scrollY }));
  }
</script>

<svelte:window bind:scrollX bind:scrollY />
