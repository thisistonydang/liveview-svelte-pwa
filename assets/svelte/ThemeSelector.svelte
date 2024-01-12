<script>
  import { onMount } from "svelte";

  import { currentTheme } from "../stores/clientOnlyState";

  import ThemeButton from "./ThemeButton.svelte";
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
