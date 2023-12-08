<script>
  import { onMount } from "svelte";

  export let scrollPositionKey;

  function restoreScrollPosition() {
    const scrollPosition = localStorage.getItem(scrollPositionKey);
    if (!scrollPosition) return;

    try {
      const { x, y } = JSON.parse(scrollPosition);
      if (typeof x !== "number" || typeof y !== "number") return;

      window.scrollTo(x, y);
      localStorage.removeItem(scrollPositionKey);
    } catch (error) {
      console.error("Error restoring scroll position.", error);
    }
  }

  onMount(() => {
    const timeoutId = setTimeout(restoreScrollPosition, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  });
</script>
