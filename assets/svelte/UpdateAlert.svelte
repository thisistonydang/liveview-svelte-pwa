<script>
  import { fly } from "svelte/transition";

  import { isConnected, isSWUpdateAvailable, isSWUpdateConfirmed } from "lib/offline-svelte";
  import InfoSvgIcon from "lib/svg-icons/InfoSvgIcon.svelte";

  let showAlert = false;

  /** @type {number} */
  let width;

  $: if ($isSWUpdateAvailable) {
    isConnected({ timeout: 10000 }).then((connected) => {
      if (connected) {
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
