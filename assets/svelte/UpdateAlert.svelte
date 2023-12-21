<script>
  import { fly } from "svelte/transition";

  import {
    connectionStatus,
    isSWUpdateAvailable,
    isSWUpdateConfirmed,
  } from "../lib/offline-svelte";

  import InfoSvgIcon from "./InfoSvgIcon.svelte";

  let isDismissed = false;
  let width;
</script>

{#if $connectionStatus === "Connected" && $isSWUpdateAvailable && !isDismissed}
  <div
    transition:fly={{ y: -100, duration: 750 }}
    bind:clientWidth={width}
    role="alert"
    style:margin-left={`-${width / 2}px`}
    class="fixed left-1/2 w-full sm:max-w-sm z-40"
  >
    <div class="alert shadow-lg border border-neutral m-2" style:width={`${width - 16}px`}>
      <InfoSvgIcon />

      <div>
        <h3 class="font-bold">Update Available</h3>
        <div class="text-sm">Reload to update?</div>
      </div>

      <div>
        <button class="btn btn-sm" on:click={() => (isDismissed = true)}>Later</button>

        <button
          class="btn btn-sm btn-accent"
          on:click={() => {
            $isSWUpdateConfirmed = true;
            isDismissed = true;
          }}
        >
          Update
        </button>
      </div>
    </div>
  </div>
{/if}
