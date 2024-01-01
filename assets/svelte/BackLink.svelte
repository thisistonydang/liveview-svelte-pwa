<script>
  import ArrowLeftSvgIcon from "./ArrowLeftSvgIcon.svelte";

  export let live;
  live;

  export let linkTo;
  export let ariaLabel = "Back";
</script>

<a
  class="flex h-10 w-10"
  href={linkTo}
  aria-label={ariaLabel}
  on:click|preventDefault={() => {
    window.location.replace(linkTo);
  }}
>
  <ArrowLeftSvgIcon />
</a>
