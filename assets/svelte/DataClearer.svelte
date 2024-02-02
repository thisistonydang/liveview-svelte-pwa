<script context="module">
  import { requestAssetDeletion } from "../lib/offline-svelte";
  import config from "../../priv/static/sw.config.js";

  export const indexedDBName = "ToDo";

  export function clearUserData() {
    // Clear client state.
    localStorage.clear();

    // Clear cached assets.
    requestAssetDeletion(config.privateAssets);

    // Clear indexedDB.
    const DBDeleteRequest = window.indexedDB.deleteDatabase(indexedDBName);
    DBDeleteRequest.onerror = () => {
      console.error("Error deleting database.");
    };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  export let live = undefined;
  live;

  onMount(() => {
    clearUserData();
  });
</script>
