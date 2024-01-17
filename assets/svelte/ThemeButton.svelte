<script lang="ts">
  import SwatchSvgIcon from "lib/svg-icons/SwatchSvgIcon.svelte";

  import { openedMenuId } from "../stores/clientOnlyState";
  import ThemeChoiceButton from "./ThemeChoiceButton.svelte";

  export let menuClass: string;

  const themeMenuId = "theme-menu-id";
</script>

<div class="{menuClass} relative">
  <button
    class="my-1 btn btn-circle btn-neutral"
    aria-label="Theme Selector"
    on:click={() => ($openedMenuId = $openedMenuId === themeMenuId ? "" : themeMenuId)}
  >
    <SwatchSvgIcon className="h-6 w-6" />
  </button>

  {#if $openedMenuId === themeMenuId}
    <div class="menu bg-base-200 border border-neutral rounded-box absolute right-0">
      <p class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-1.5">Theme</p>

      <ul class="w-28">
        <ThemeChoiceButton theme="system" />
        <ThemeChoiceButton theme="light" />
        <ThemeChoiceButton theme="dark" />
      </ul>
    </div>
  {/if}
</div>
