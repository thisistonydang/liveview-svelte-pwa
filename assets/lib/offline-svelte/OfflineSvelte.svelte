<script>
  import { onMount } from "svelte";

  import { OFFLINE_SVELTE_DIV_ID } from "./lib/constants";
  import ScrollPositionRestorer from "./components/ScrollPositionRestorer.svelte";

  export let scrollPositionKey = "scrollPosition";

  let mounted;

  onMount(() => {
    mounted = true;

    return () => {
      mounted = false;
    };
  });
</script>

<div id={OFFLINE_SVELTE_DIV_ID} data-mounted={mounted} />

<ScrollPositionRestorer {scrollPositionKey} />
