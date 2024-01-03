<script>
  import CheckSvgIconMicro from "lib/heroicons/CheckSvgIconMicro.svelte";

  import { currentTheme } from "../lib/currentTheme";
  import { setTheme } from "../lib/setTheme";

  /** @type {"system" | "light" | "dark"} */
  export let theme;
</script>

<li>
  <button on:click={() => setTheme(theme)}>
    <span class="first-letter:capitalize">{theme}</span>

    {#if theme === $currentTheme}
      <CheckSvgIconMicro className="h-4 w-4" />
    {/if}
  </button>
</li>
