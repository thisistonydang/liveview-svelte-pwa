<script lang="ts">
  import { onMount } from "svelte";

  import { liveView, serverDocument, sessionCount } from "../stores/liveViewSocket";
  import VisibilityChangeTracker from "./VisibilityChangeTracker.svelte";

  // Store 'live' object from live_svelte in a Svelte store.
  export let live;
  $liveView = live;

  // Receive socket assigns from LiveView.
  export let server_document: string;
  export let session_count: number;

  // Assign socket assigns to reactive stores.
  $: $serverDocument = server_document;
  $: $sessionCount = session_count;

  onMount(() => {
    live.pushEvent("request_server_state");
  });
</script>

<VisibilityChangeTracker {live} />
