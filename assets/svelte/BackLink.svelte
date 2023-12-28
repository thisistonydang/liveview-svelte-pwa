<script>
  import ArrowLeftSvgIcon from "./ArrowLeftSvgIcon.svelte";

  export let live;
  live;

  export let linkTo;
  export let linkText;
</script>

<div class="my-4">
  <a
    class="link link-accent no-underline text-sm font-semibold flex items-center gap-1"
    href={linkTo}
    on:click|preventDefault={() => {
      window.location.replace(linkTo);
    }}
  >
    <span class="h-3 w-3">
      <ArrowLeftSvgIcon />
    </span>

    {linkText}
  </a>
</div>
