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

  function handleDragKeyDown(event: KeyboardEvent) {
    if ((event.key === "Enter" || event.key === " ") && dragDisabled) {
      dragDisabled = false;
    }
  }
</script>

<button
  title="Drag to sort"
  aria-label="Drag to sort."
  class:cursor-grab={dragDisabled}
  class:cursor-grabbing={!dragDisabled}
  on:mousedown={handleStartDrag}
  on:touchstart={handleStartDrag}
  on:keydown={handleDragKeyDown}
  use:clickOutside={() => (dragDisabled = true)}
>
  <Bars3SvgIcon className="w-6 h-6" />
</button>
