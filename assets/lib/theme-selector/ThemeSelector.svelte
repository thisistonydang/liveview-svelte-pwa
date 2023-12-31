<script>
  import { onMount } from "svelte";

  import { currentTheme } from "./lib/currentTheme";

  import ThemeButton from "./components/ThemeButton.svelte";
  import ThemeSyncManager from "./ThemeSyncManager.svelte";

  onMount(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));

    if (!theme) {
      $currentTheme = "system";
    } else {
      $currentTheme = theme;
    }
  });
</script>

<ThemeButton />
<ThemeSyncManager />
