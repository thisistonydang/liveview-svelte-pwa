<script>
  import { onMount } from "svelte";

  import { pollIntervalId } from "../lib/pollIntervalId";
  import { requestOnlineStatus } from "../lib/requestOnlineStatus";

  export let liveViewPath;

  onMount(() => {
    const url = new URL(window.location.href);

    if (url.pathname !== liveViewPath) {
      $pollIntervalId = setInterval(requestOnlineStatus, 1000);
    }
  });
</script>
