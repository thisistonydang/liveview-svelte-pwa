<script>
  import ArrowLeftSvgIcon from "lib/svg-icons/ArrowLeftSvgIcon.svelte";
  import { showTopBar } from "lib/topbar";

  export let live = undefined;
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

      if (history.length === 1) {
        window.location.replace("/app");
      } else {
        history.back();
      }
    }}
  >
    <ArrowLeftSvgIcon className="h-10 w-10" />
  </button>
{/if}
