<script>
  import { fly } from "svelte/transition";
  import { isOnline, isSWUpdateAvailable, isSWUpdateConfirmed } from "../lib/offline-svelte";

  let isDismissed = false;
  let width;
</script>

{#if $isOnline && $isSWUpdateAvailable && !isDismissed}
  <div
    transition:fly={{ y: -100, duration: 750 }}
    bind:clientWidth={width}
    role="alert"
    style:margin-left={`-${width / 2}px`}
    class="fixed left-1/2 w-full sm:max-w-sm z-40"
  >
    <div class="alert shadow-lg border border-neutral m-2" style:width={`${width - 16}px`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

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
