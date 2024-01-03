<script>
  import ArrowLeftSvgIcon from "lib/svg-icons/ArrowLeftSvgIcon.svelte";

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
  <button aria-label={ariaLabel} class="flex" on:click={() => history.back()}>
    <ArrowLeftSvgIcon className="h-10 w-10" />
  </button>
{/if}
