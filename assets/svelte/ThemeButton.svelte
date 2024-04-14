<script lang="ts">
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { SwatchBook } from "lucide-svelte";

  import { focusTrap } from "$lib/actions/focusTrap";

  import { openedMenuId } from "$stores/clientOnlyState";
  import { currentTheme } from "$stores/currentTheme";
  import ThemeChoiceButton from "./ThemeChoiceButton.svelte";

  export let menuClass: string;

  const themeMenuId = "theme-menu-id";
  let focusFirstElement = false;

  onMount(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));

    if (!theme) {
      $currentTheme = "system";
    } else {
      $currentTheme = theme;
    }
  });

  $: if ($openedMenuId !== themeMenuId) {
    focusFirstElement = false;
  }
</script>

<div class="{menuClass} relative">
  <button
    class="
      my-1 btn btn-circle btn-neutral
      focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
    "
    aria-label="Theme Selector."
    title="Click to change the theme."
    on:click={() => ($openedMenuId = $openedMenuId === themeMenuId ? "" : themeMenuId)}
    on:keydown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        focusFirstElement = true;
      }
    }}
  >
    <SwatchBook />
  </button>

  {#if $openedMenuId === themeMenuId}
    <div
      in:scale={{ duration: 100 }}
      use:focusTrap={{
        focusFirstElement,
        onEscape: () => ($openedMenuId = ""),
      }}
      class="menu bg-base-200 border border-neutral rounded-box absolute right-0"
    >
      <p class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-1.5">Theme</p>

      <ul class="w-32">
        <ThemeChoiceButton focusIndex={0} theme="system" />
        <ThemeChoiceButton focusIndex={1} theme="light" />
        <ThemeChoiceButton focusIndex={2} theme="dark" />
      </ul>
    </div>
  {/if}
</div>
