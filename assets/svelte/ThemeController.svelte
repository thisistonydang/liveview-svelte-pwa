<script>
  import { onMount } from "svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  /** @type {"light" | "dark"} */
  let theme;
  let mounted = false;
  let userExplicitlyChoseTheme = false;

  /** @type {HTMLDivElement} */
  let darkThemeToggleContainer;
  /** @type {HTMLDivElement} */
  let lightThemeToggleContainer;

  onMount(() => {
    theme = document.documentElement.dataset.theme;

    // Update class on theme toggle containers so only the correct toggle is shown.
    if (theme === "dark") {
      darkThemeToggleContainer.className = "";
      lightThemeToggleContainer.className = "hidden";
    } else {
      darkThemeToggleContainer.className = "hidden";
      lightThemeToggleContainer.className = "";
    }

    mounted = true;
  });

  // Track theme in localStorage if the user has explicitly chosen a theme.
  $: if (mounted && userExplicitlyChoseTheme) localStorage.setItem("theme", theme);

  /**
   * Handle theme toggle.
   *
   * @param {HTMLInputElement} checkbox
   */
  function onThemeToggle(checkbox) {
    userExplicitlyChoseTheme = true;

    // Toggle the checkbox.
    checkbox.checked = !checkbox.checked;

    // Set theme based on checkbox state.
    theme = checkbox.checked ? "dark" : "light";

    // Set the theme on the document.
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
</script>

<!-- Show checked toggle if theme is dark. -->
<div bind:this={darkThemeToggleContainer} class="hidden dark:block">
  <ThemeToggle checked {onThemeToggle} />
</div>

<!-- Show unchecked toggle if theme is light. -->
<div bind:this={lightThemeToggleContainer} class="dark:hidden">
  <ThemeToggle checked={false} {onThemeToggle} />
</div>
