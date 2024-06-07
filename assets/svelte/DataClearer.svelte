<script lang="ts" context="module">
  import { privateAssets } from "$lib/assets";
  import { requestAssetDeletion } from "./ServiceWorker.svelte";

  export const indexedDBName = "ToDo";

  export function clearUserData() {
    // Clear client storage.
    localStorage.clear();
    sessionStorage.clear();

    // Clear private assets cached by service worker.
    requestAssetDeletion(privateAssets);

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
