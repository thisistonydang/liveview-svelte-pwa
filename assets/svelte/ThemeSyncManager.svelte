<script lang="ts">
  import { setTheme } from "./ThemeChoiceButton.svelte";

  import type { Live } from "live_svelte";

  export let live: Live = undefined;
  live;
</script>

<!-- Keep theme synced when theme is updated in localStorage on another
tab/window of the same browser. -->
<svelte:window
  on:storage={({ key, newValue }) => {
    if (key !== "theme") return;

    const theme = JSON.parse(newValue) || "system";
    setTheme(theme);
  }}
/>
