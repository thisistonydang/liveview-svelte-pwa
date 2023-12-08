<script>
  import { onMount } from "svelte";

  import { SCROLL_POSITION_KEY } from "./constants";

  export let scrollPositionKey = SCROLL_POSITION_KEY;

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
