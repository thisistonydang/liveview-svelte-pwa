<script lang="ts">
  import { onMount } from "svelte";

  import { currentTheme } from "../stores/currentTheme";

  import ThemeButton from "./ThemeButton.svelte";

  export let menuClass: string;

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
