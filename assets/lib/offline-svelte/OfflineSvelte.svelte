<script>
  import { onMount } from "svelte";

  import { FALLBACK_PATH, OFFLINE_SVELTE_DIV_ID } from "./lib/constants";
  import OnlineStatusPoller from "./components/OnlineStatusPoller.svelte";
  import ScrollPositionRestorer from "./components/ScrollPositionRestorer.svelte";

  export let fallbackPath = FALLBACK_PATH;
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
<OnlineStatusPoller {fallbackPath} />
