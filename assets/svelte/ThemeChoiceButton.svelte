<script lang="ts" context="module">
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
  import { Check, Laptop, Moon, Sun } from "lucide-svelte";
  import { currentTheme } from "$stores/currentTheme";

  export let focusIndex: number;
  export let theme: "system" | "light" | "dark";
</script>

<li>
  <button
    data-focusindex={focusIndex}
    class="focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100"
    on:click={() => setTheme(theme)}
  >
    {#if theme === "system"}
      <Laptop class="h-4 w-4" />
    {:else if theme === "light"}
      <Sun class="h-4 w-4" />
    {:else if theme === "dark"}
      <Moon class="h-4 w-4" />
    {/if}

    <span class="first-letter:capitalize">{theme}</span>

    {#if theme === $currentTheme}
      <Check class="h-4 w-4" />
    {/if}
  </button>
</li>
