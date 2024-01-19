<script>
  import ServiceWorkerMessageHandler from "./components/ServiceWorkerMessageHandler.svelte";
  import ServiceWorkerUpdater from "./components/ServiceWorkerUpdater.svelte";

  export let scrollPositionKey = "scrollPosition";
</script>

<ServiceWorkerMessageHandler />
<ServiceWorkerUpdater />
