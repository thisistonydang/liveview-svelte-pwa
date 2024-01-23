<script lang="ts">
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";

  import SwatchSvgIcon from "lib/svg-icons/SwatchSvgIcon.svelte";

  import { openedMenuId } from "../stores/clientOnlyState";
  import { currentTheme } from "../stores/currentTheme";
  import ThemeChoiceButton from "./ThemeChoiceButton.svelte";

  export let menuClass: string;

  const themeMenuId = "theme-menu-id";

  onMount(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));

    if (!theme) {
      $currentTheme = "system";
    } else {
      $currentTheme = theme;
    }
  });
</script>

<div class="{menuClass} relative">
  <button
    class="
      my-1 btn btn-circle btn-neutral
      focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
    "
    aria-label="Theme Selector."
    title="Click to change the theme (system, dark, light)."
    on:click={() => ($openedMenuId = $openedMenuId === themeMenuId ? "" : themeMenuId)}
  >
    <SwatchSvgIcon className="h-6 w-6" />
  </button>

  {#if $openedMenuId === themeMenuId}
    <div
      in:scale={{ duration: 100 }}
      class="menu bg-base-200 border border-neutral rounded-box absolute right-0"
    >
      <p class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-1.5">Theme</p>

      <ul class="w-28">
        <ThemeChoiceButton theme="system" />
        <ThemeChoiceButton theme="light" />
        <ThemeChoiceButton theme="dark" />
      </ul>
    </div>
  {/if}
</div>
