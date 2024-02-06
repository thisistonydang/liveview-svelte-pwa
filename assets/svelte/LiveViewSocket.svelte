<script lang="ts">
  import { liveView, serverDocument, sessionCount } from "../stores/liveViewSocket";
  import VisibilityChangeTracker from "./VisibilityChangeTracker.svelte";

  import type { Live } from "live_svelte";

  // Store 'live' object from live_svelte in a Svelte store.
  export let live: Live;
  $liveView = live;

  // Receive socket assigns from LiveView.
  export let server_document: { event: string; document: string | null };
  export let session_count: number;

  // Assign socket assigns to reactive stores.
  $: $serverDocument = server_document;
  $: $sessionCount = session_count;
</script>

<VisibilityChangeTracker {live} />
