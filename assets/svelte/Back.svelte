<script>
  import ArrowLeftSvgIcon from "lib/svg-icons/ArrowLeftSvgIcon.svelte";
  import { showTopBar } from "lib/topbar";

  export let live;
  live;

  export let href = undefined;
  export let ariaLabel = "Back";
</script>

{#if href}
  <a {href} aria-label={ariaLabel}>
    <ArrowLeftSvgIcon className="h-10 w-10" />
  </a>
{:else}
  <button
    aria-label={ariaLabel}
    class="flex"
    on:click={() => {
      showTopBar();
      history.back();

      // If back() doesn't work, fallback to /app so the user is not stuck.
      setTimeout(() => {
        window.location.href = "/app";
      }, 500);
    }}
  >
    <ArrowLeftSvgIcon className="h-10 w-10" />
  </button>
{/if}
