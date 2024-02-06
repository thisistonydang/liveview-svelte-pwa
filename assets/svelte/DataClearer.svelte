<script lang="ts" context="module">
  import config from "../../priv/static/sw.config.js";

  import { requestAssetDeletion } from "./ServiceWorkerMessageHandler.svelte";

  export const indexedDBName = "ToDo";

  export function clearUserData() {
    // Clear client state in localStorage.
    localStorage.clear();

    // Clear private assets cached by service worker.
    requestAssetDeletion(config.privateAssets);

    // Clear Yjs state stored in indexedDB.
    const DBDeleteRequest = window.indexedDB.deleteDatabase(indexedDBName);
    DBDeleteRequest.onerror = () => {
      console.error("Error deleting database.");
    };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import type { Live } from "live_svelte";

  export let live: Live = undefined;
  live;

  onMount(() => {
    clearUserData();
  });
</script>
