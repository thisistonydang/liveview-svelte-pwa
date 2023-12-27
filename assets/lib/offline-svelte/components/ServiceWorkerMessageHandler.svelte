<script>
  import { onMount } from "svelte";

  onMount(() => {
    navigator.serviceWorker?.addEventListener("message", (event) => {
      switch (event.data.type) {
        case "request_skip_waiting":
          window.location.reload();
          break;

        default:
          console.error("Unknown message type received from service worker.", event.data);
      }
    });
  });
</script>
