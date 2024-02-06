<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  import config from "../../priv/static/sw.config.js";
  import { useIsConnected } from "$lib/hooks/useIsConnected";
  import InfoSvgIcon from "$lib/svg-icons/InfoSvgIcon.svelte";

  let newSW: ServiceWorker;
  let showAlert = false;
  let isSWUpdateAvailable = false;
  let isSWUpdateConfirmed = false;
  let width: number;

  let width: number;

  $: if ($isSWUpdateAvailable) {
    useIsConnected({ timeout: 10000 }).then((isConnected) => {
      if (isConnected) {
        showAlert = true;
      }
    });
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
    <InfoSvgIcon className="h-6 w-6" />

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
          $isSWUpdateConfirmed = true;
          showAlert = false;
        }}
      >
        Update
      </button>
    </div>
  </div>
{/if}
