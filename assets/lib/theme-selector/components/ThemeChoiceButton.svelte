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
      <CheckSvgIcon className="h-3 w-3" />
    {/if}
  </button>
</li>
