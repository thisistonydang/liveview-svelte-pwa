<script>
  import { clickOutside } from "lib/actions/clickOutside";
  import SwatchSvgIcon from "lib/svg-icons/SwatchSvgIcon.svelte";

  import { isThemeMenuOpened } from "../lib/isThemeMenuOpened";
  import ThemeChoiceButton from "./ThemeChoiceButton.svelte";
</script>

<details
  class="dropdown dropdown-end"
  bind:open={$isThemeMenuOpened}
  use:clickOutside={() => ($isThemeMenuOpened = false)}
>
  <summary class="my-1 btn btn-circle btn-neutral" aria-label="Theme Selector">
    <SwatchSvgIcon className="h-6 w-6" />
  </summary>

  <div class="dropdown-content menu bg-base-200 border border-neutral rounded-box">
    <p class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-1.5">Theme</p>

    <ul class="w-28">
      <ThemeChoiceButton theme="system" />
      <ThemeChoiceButton theme="light" />
      <ThemeChoiceButton theme="dark" />
    </ul>
  </div>
</details>
