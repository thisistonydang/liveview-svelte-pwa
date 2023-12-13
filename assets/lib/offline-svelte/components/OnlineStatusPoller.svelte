<script>
  import { onMount } from "svelte";

  import { pollIntervalId } from "../lib/pollIntervalId";
  import { requestOnlineStatus } from "../lib/requestOnlineStatus";

  export let fallbackPath;

  onMount(() => {
    const url = new URL(window.location.href);

    if (url.pathname === fallbackPath) {
      $pollIntervalId = setInterval(requestOnlineStatus, 1000);
    }
  });
</script>
