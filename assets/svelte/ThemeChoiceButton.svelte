<script context="module">
  export function setTheme(theme: "system" | "light" | "dark") {
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

<script lang="ts">
  import CheckSvgIconMicro from "lib/svg-icons/CheckSvgIconMicro.svelte";

  import { currentTheme } from "../stores/currentTheme";

  export let theme: "system" | "light" | "dark";
</script>

<li>
  <button on:click={() => setTheme(theme)}>
    <span class="first-letter:capitalize">{theme}</span>

    {#if theme === $currentTheme}
      <CheckSvgIconMicro className="h-4 w-4" />
    {/if}
  </button>
</li>
