<script>
  import { onMount } from "svelte";

  import { pollIntervalId } from "../lib/pollIntervalId";
  import { requestOnlineStatus } from "../lib/requestOnlineStatus";

  onMount(() => {
    $pollIntervalId = setInterval(requestOnlineStatus, 1000);
  });
</script>
