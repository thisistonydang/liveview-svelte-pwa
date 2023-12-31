<script>
  import { setTheme } from "./lib/setTheme";
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
