<script lang="ts">
  import { onMount } from "svelte";

  import {
    isListsOpened,
    isTodoOpened,
    itemToProcessId,
    newList,
    newTodo,
    openedMenuId,
    selectedListId,
  } from "../stores/clientOnlyState";
  import { syncState } from "../stores/syncState";

  export let isClientStateRestored: boolean;

  /**
   * Get parsed value from sessionStorage.
   *
   * @param key - Key to get from sessionStorage.
   * @param type - Type of value.
   * @param defaultValue - Default value to return if value is not found in sessionStorage.
   */
  function getParsedValue<T>(key: string, type: string, defaultValue: T): T {
    const value = sessionStorage.getItem(key);

    if (!value) return defaultValue;

    try {
      const parsedValue = JSON.parse(value);
      return typeof parsedValue === type ? parsedValue : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  onMount(() => {
    // Sync client state stores with sessionStorage on startup.
    $isListsOpened = getParsedValue("isListsOpened", "boolean", $isListsOpened);
    $isTodoOpened = getParsedValue("isTodoOpened", "boolean", $isTodoOpened);
    $itemToProcessId = getParsedValue("itemToProcessId", "string", $itemToProcessId);
    $newList = getParsedValue("newList", "string", $newList);
    $newTodo = getParsedValue("newTodo", "string", $newTodo);
    $openedMenuId = getParsedValue("openedMenuId", "string", $openedMenuId);
    // $selectedListId is not set here because it is set in StateManagement
    // $syncState is not set here because it is set in StateManagement

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
    sessionStorage.setItem("selectedListId", JSON.stringify($selectedListId));
    sessionStorage.setItem("syncState", JSON.stringify($syncState));
  }
</script>

<!-- Keep client state synced across different windows and tabs of the same browser. -->
<svelte:window
  on:storage={({ key, newValue }) => {
    switch (key) {
      case "isListsOpened":
        $isListsOpened = JSON.parse(newValue);
        break;

      case "isTodoOpened":
        $isTodoOpened = JSON.parse(newValue);
        break;

      case "itemToProcessId":
        $itemToProcessId = JSON.parse(newValue);
        break;

      case "newList":
        $newList = JSON.parse(newValue);
        break;

      case "newTodo":
        $newTodo = JSON.parse(newValue);
        break;

      case "openedMenuId":
        $openedMenuId = JSON.parse(newValue);
        break;

      case "selectedListId":
        $selectedListId = JSON.parse(newValue);
        break;

      case "syncState":
        $syncState = JSON.parse(newValue);
        break;
    }
  }}
/>
