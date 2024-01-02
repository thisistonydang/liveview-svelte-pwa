<script>
  import { isAboutPageOpened } from "../stores/clientOnlyState";

  import AppInfo from "./AppInfo.svelte";
  import ArrowLeftSvgIcon from "./ArrowLeftSvgIcon.svelte";
</script>

<div class="sticky top-0 left-0 w-full py-1 z-10 bg-base-100 border-neutral border-b h-14">
  <div class="max-w-2xl mx-auto px-2 md:p-0 h-full flex items-center">
    <button aria-label="Back" on:click={() => ($isAboutPageOpened = false)}>
      <ArrowLeftSvgIcon className="h-10 w-10" />
    </button>
  </div>
</div>

<AppInfo />
