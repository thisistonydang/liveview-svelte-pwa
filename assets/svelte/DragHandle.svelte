<script lang="ts">
  import { clickOutside } from "lib/actions/clickOutside";
  import Bars3SvgIcon from "lib/svg-icons/Bars3SvgIcon.svelte";

  import { openedMenuId } from "../stores/clientOnlyState";

  export let dragDisabled: boolean;

  function handleStartDrag(event: MouseEvent | TouchEvent) {
    // Preventing default to prevent lag on touch devices (because of the
    // browser checking for screen scrolling).
    event.preventDefault();
    dragDisabled = false;
    $openedMenuId = "";
  }
</script>

<button
  title="Drag to sort."
  aria-label="Drag to sort."
  class="
    rounded-lg
    focus:outline-none focus-visible:ring ring-accent
  "
  class:cursor-grab={dragDisabled}
  class:cursor-grabbing={!dragDisabled}
  tabindex="-1"
  on:mousedown={handleStartDrag}
  on:touchstart={handleStartDrag}
  use:clickOutside={() => (dragDisabled = true)}
>
  <Bars3SvgIcon className="w-6 h-6" />
</button>
