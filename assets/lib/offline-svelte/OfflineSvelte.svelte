<script>
  import ScrollPositionRestorer from "./components/ScrollPositionRestorer.svelte";
  import ServiceWorkerUpdater from "./components/ServiceWorkerUpdater.svelte";

  export let scrollPositionKey = "scrollPosition";
</script>

<ScrollPositionRestorer {scrollPositionKey} />
<ServiceWorkerUpdater />
