<script>
  import { onMount } from "svelte";

  /** @type {string} */
  export let className;
  export let callbackFunction;

  /**
   * @param {PointerEvent} event
   */
  function clickOutsideClassHandler(event) {
    const elementsToIgnore = document.getElementsByClassName(className);

    for (const element of elementsToIgnore) {
      if (element.contains(event.target)) {
        return;
      }
    }

    callbackFunction(event);
  }

  onMount(() => {
    document.documentElement.addEventListener("click", clickOutsideClassHandler);

    return () => {
      document.documentElement.removeEventListener("click", clickOutsideClassHandler);
    };
  });
</script>
