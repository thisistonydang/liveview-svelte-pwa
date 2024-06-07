<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Info } from "lucide-svelte";

  import { useIsConnected } from "$lib/hooks/useIsConnected";

  let newSW: ServiceWorker;
  let showAlert = false;
  let isSWUpdateAvailable = false;
  let isSWUpdateConfirmed = false;
  let width: number;

  async function detectSWUpdate() {
    // Get current active SW.
    const registration = await navigator.serviceWorker.ready;

    // Check if there is a new SW already installed and waiting.
    newSW = registration.waiting;
    if (newSW) {
      isSWUpdateAvailable = true;
      return;
    }

    // If no waiting SW, listen for new SW install.
    registration.addEventListener("updatefound", () => {
      newSW = registration.installing;
      newSW?.addEventListener("statechange", () => {
        if (newSW.state === "installed") {
          isSWUpdateAvailable = true;
        }
      });
    });
  }

  onMount(() => {
    detectSWUpdate();
  });

  $: if (isSWUpdateAvailable) {
    useIsConnected({ timeout: 10000 }).then((isConnected) => {
      if (isConnected) {
        showAlert = true;
      }
    });
  }

  $: if (isSWUpdateConfirmed) {
    // TODO: Message type is currently hardcoded due to Firefox not supporting
    // ES modules in service workers so the values can't be imported :(
    newSW.postMessage({ type: "request_skip_waiting" });
  }
</script>

{#if showAlert}
  <div
    role="alert"
    transition:fly={{ y: -100, duration: 750 }}
    bind:clientWidth={width}
    style:margin-left={`-${width / 2}px`}
    class="
      fixed left-1/2 max-w-[90vw] xs:max-w-sm z-40
      alert shadow-lg border border-neutral m-2
    "
  >
    <Info />

    <div>
      <h3 class="font-bold">Update Available</h3>
      <div class="text-sm">Reload to update?</div>
    </div>

    <div>
      <button
        class="btn btn-sm border border-neutral transition-none"
        on:click={() => (showAlert = false)}
      >
        Later
      </button>

      <button
        class="btn btn-sm btn-accent border border-neutral"
        on:click={() => {
          isSWUpdateConfirmed = true;
          showAlert = false;
        }}
      >
        Update
      </button>
    </div>
  </div>
{/if}
