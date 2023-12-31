<script>
  import { currentTheme } from "../lib/currentTheme";
  import { setTheme } from "../lib/setTheme";

  import CheckSvgIcon from "./CheckSvgIcon.svelte";

  /** @type {"system" | "light" | "dark"} */
  export let theme;
</script>

<li>
  <button on:click={() => setTheme(theme)}>
    <span class="first-letter:capitalize">{theme}</span>

    {#if theme === $currentTheme}
      <span class="w-3 h-3">
        <CheckSvgIcon />
      </span>
    {/if}
  </button>
</li>
