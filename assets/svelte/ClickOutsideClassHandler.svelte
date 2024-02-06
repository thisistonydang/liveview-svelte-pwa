<script lang="ts">
  import { onMount } from "svelte";

  export let className: string;
  export let callbackFunction: (event: PointerEvent) => void;

  function clickOutsideClassHandler(event: PointerEvent) {
    if (!(event.target instanceof Node)) return;

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
