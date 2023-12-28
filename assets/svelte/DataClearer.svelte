<script>
  import { onMount } from "svelte";
  import { requestAssetDeletion } from "../lib/offline-svelte";
  import config from "../../priv/static/sw.config.js";

  export let live;
  live;

  onMount(() => {
    localStorage.clear();
    requestAssetDeletion(config.privateAssets);
  });
</script>
