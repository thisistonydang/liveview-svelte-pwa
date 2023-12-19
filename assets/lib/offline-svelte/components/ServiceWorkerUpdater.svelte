<script>
  import { onMount } from "svelte";

  import { isSWUpdateAvailable } from "../lib/isSWUpdateAvailable";
  import { isSWUpdateConfirmed } from "../lib/isSWUpdateConfirmed";

  let newSW;

  async function detectSWUpdate() {
    // Get current active SW.
    const registration = await navigator.serviceWorker.ready;

    // Check if there is a new SW already installed and waiting.
    newSW = registration.waiting;
    if (newSW) {
      $isSWUpdateAvailable = true;
      return;
    }

    // If no waiting SW, listen for new SW install.
    registration.addEventListener("updatefound", () => {
      newSW = registration.installing;
      newSW?.addEventListener("statechange", () => {
        if (newSW.state === "installed") {
          $isSWUpdateAvailable = true;
        }
      });
    });
  }

  onMount(() => {
    detectSWUpdate();
  });

  $: if ($isSWUpdateConfirmed) {
    newSW.postMessage({ type: "request_skip_waiting" });
  }
</script>
