<script lang="ts" context="module">
  /**
   * Get parsed value from sessionStorage.
   *
   * @param key - Key to get from sessionStorage.
   * @param type - Type of value.
   * @param defaultValue - Default value to return if value is not found in sessionStorage.
   */
  export function getParsedValue<T>(key: string, type: string, defaultValue: T): T {
    const value = sessionStorage.getItem(key);

    if (!value) return defaultValue;

    try {
      const parsedValue = JSON.parse(value);
      return typeof parsedValue === type ? parsedValue : defaultValue;
    } catch {
      return defaultValue;
    }
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import {
    isListsOpened,
    isTodoOpened,
    itemToProcessId,
    newList,
    newTodo,
    openedMenuId,
  } from "$stores/clientOnlyState";

  export let isClientStateRestored: boolean;

  onMount(() => {
    // Sync client state stores with sessionStorage on startup. This is mainly
    // to restore UI if the browser unexpectedly refreshes.
    $isListsOpened = getParsedValue("isListsOpened", "boolean", $isListsOpened);
    $isTodoOpened = getParsedValue("isTodoOpened", "boolean", $isTodoOpened);
    $itemToProcessId = getParsedValue("itemToProcessId", "string", $itemToProcessId);
    $newList = getParsedValue("newList", "string", $newList);
    $newTodo = getParsedValue("newTodo", "string", $newTodo);
    $openedMenuId = getParsedValue("openedMenuId", "string", $openedMenuId);

    // Let offline-svelte know that the client state has been restored in order
    // to restore scroll position.
    isClientStateRestored = true;
  });

  // Keep sessionStorage in sync with client state stores.
  $: if (isClientStateRestored) {
    sessionStorage.setItem("isListsOpened", JSON.stringify($isListsOpened));
    sessionStorage.setItem("isTodoOpened", JSON.stringify($isTodoOpened));
    sessionStorage.setItem("itemToProcessId", JSON.stringify($itemToProcessId));
    sessionStorage.setItem("newList", JSON.stringify($newList));
    sessionStorage.setItem("newTodo", JSON.stringify($newTodo));
    sessionStorage.setItem("openedMenuId", JSON.stringify($openedMenuId));
  }
</script>
