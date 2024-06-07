<script lang="ts" context="module">
  import { requestAssetDeletion } from "./ServiceWorker.svelte";

  export const indexedDBName = "ToDo";

  export function clearUserData() {
    // Clear client storage.
    localStorage.clear();
    sessionStorage.clear();

    // Clear private assets cached by service worker.
    // TODO: Private assets currently hardcoded due to Firefox not supporting ES
    // modules in service workers so the values can't be imported :(
    requestAssetDeletion(["/app"]);

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
