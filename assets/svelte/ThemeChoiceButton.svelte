<script context="module">
  /**
   * Set the theme.
   *
   * @param {"system" | "light" | "dark"} theme
   * @returns {void}
   */
  export function setTheme(theme) {
    currentTheme.set(theme);

    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
      return;
    }

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", JSON.stringify(theme));
  }
</script>

<script>
  import CheckSvgIconMicro from "lib/svg-icons/CheckSvgIconMicro.svelte";

  import { currentTheme } from "../stores/clientOnlyState";

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
