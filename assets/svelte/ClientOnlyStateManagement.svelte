<script>
  import { onMount } from "svelte";

  import { isClientStateRestored } from "lib/offline-svelte";

  import {
    isListsOpened,
    isTodoOpened,
    itemToProcessId,
    newList,
    newTodo,
    openedMenuId,
    selectedListId,
  } from "../stores/clientOnlyState";
  import { todoItems, todoLists } from "../stores/crdtState";
  import { syncState } from "../stores/syncState";

  /**
   * Get parsed value from localStorage.
   *
   * @param {string} key - Key to get from localStorage.
   * @param {string} type - Type of value.
   * @param {string | boolean} defaultValue - Default value to return if value is not found in localStorage.
   *
   * @returns {string | boolean} - Parsed value from localStorage or default value.
   */
  function getParsedValue(key, type, defaultValue) {
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
    $isClientStateRestored = true;
  });

  // Keep localStorage in sync with client state stores.
  $: if ($isClientStateRestored) {
    localStorage.setItem("isListsOpened", JSON.stringify($isListsOpened));
    localStorage.setItem("isTodoOpened", JSON.stringify($isTodoOpened));
    localStorage.setItem("itemToProcessId", JSON.stringify($itemToProcessId));
    localStorage.setItem("newList", JSON.stringify($newList));
    localStorage.setItem("newTodo", JSON.stringify($newTodo));
    localStorage.setItem("openedMenuId", JSON.stringify($openedMenuId));
    localStorage.setItem("selectedListId", JSON.stringify($selectedListId));
    localStorage.setItem("syncState", JSON.stringify($syncState));
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

      case "clientState":
        const clientState = JSON.parse(newValue);
        $todoItems = clientState.value.todos;
        $todoLists = clientState.value.lists;
        break;
    }
  }}
/>
