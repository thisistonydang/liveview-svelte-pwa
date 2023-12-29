<script>
  import { onMount } from "svelte";
  import { isClientStateRestored } from "../lib/offline-svelte";
  import {
    isAccountMenuOpened,
    isCompletedOpened,
    isTodoOpened,
    newTodo,
  } from "../stores/clientOnlyState";

  /**
   * Get parsed value from localStorage.
   *
   * @param {string} key - Key to get from localStorage.
   * @param {string} type - Type of value.
   * @param {boolean} defaultValue - Default value to return if value is not found in localStorage.
   */
  function getParseValue(key, type, defaultValue) {
    const value = localStorage.getItem(key);

    if (!value) return defaultValue;

    try {
      const parsedValue = JSON.parse(value);
      return typeof parsedValue === type ? parsedValue : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  onMount(() => {
    // Sync client state stores with localStorage on startup.
    $isAccountMenuOpened = getParseValue("isAccountMenuOpened", "boolean", $isAccountMenuOpened);
    $isTodoOpened = getParseValue("isTodoOpened", "boolean", $isTodoOpened);
    $isCompletedOpened = getParseValue("isCompletedOpened", "boolean", $isCompletedOpened);
    $newTodo = getParseValue("newTodo", "string", $newTodo);

    // Let offline-svelte know that the client state has been restored in order
    // to restore scroll position.
    $isClientStateRestored = true;
  });

  // Keep localStorage in sync with client state stores.
  $: if ($isClientStateRestored) {
    localStorage.setItem("isAccountMenuOpened", JSON.stringify($isAccountMenuOpened));
    localStorage.setItem("isTodoOpened", JSON.stringify($isTodoOpened));
    localStorage.setItem("isCompletedOpened", JSON.stringify($isCompletedOpened));
    localStorage.setItem("newTodo", JSON.stringify($newTodo));
  }
</script>
