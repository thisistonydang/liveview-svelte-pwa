<script lang="ts">
  import ScrollPositionRestorer from "./components/ScrollPositionRestorer.svelte";
  import ServiceWorkerMessageHandler from "./components/ServiceWorkerMessageHandler.svelte";
  import ServiceWorkerUpdater from "./components/ServiceWorkerUpdater.svelte";

  export let scrollPositionKey = "scrollPosition";
</script>

<ScrollPositionRestorer {scrollPositionKey} />
<ServiceWorkerMessageHandler />
<ServiceWorkerUpdater />
