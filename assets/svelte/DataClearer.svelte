<script lang="ts">
  import { onMount } from "svelte";
  import { requestAssetDeletion } from "../lib/offline-svelte";
  import config from "../../priv/static/sw.config.js";

  export let live = undefined;
  live;

  onMount(() => {
    localStorage.clear();
    requestAssetDeletion(config.privateAssets);
  });
</script>
