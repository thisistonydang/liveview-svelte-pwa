<script>
  import ArrowLeftSvgIcon from "./ArrowLeftSvgIcon.svelte";

  export let live;
  live;

  export let linkTo = undefined;
  export let ariaLabel = "Back";
</script>

{#if linkTo}
  <a href={linkTo} aria-label={ariaLabel}>
    <ArrowLeftSvgIcon className="h-10 w-10" />
  </a>
{:else}
  <button aria-label={ariaLabel} on:click={() => history.back()}>
    <ArrowLeftSvgIcon className="h-10 w-10" />
  </button>
{/if}
