<script>
  import { onMount } from "svelte";

  import { currentTheme } from "../stores/currentTheme";

  import ThemeButton from "./ThemeButton.svelte";
  import ThemeSyncManager from "./ThemeSyncManager.svelte";

  /** @type {string} */
  export let menuClass;

  onMount(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));

    if (!theme) {
      $currentTheme = "system";
    } else {
      $currentTheme = theme;
    }
  });
</script>

<ThemeButton {menuClass} />
<ThemeSyncManager />
