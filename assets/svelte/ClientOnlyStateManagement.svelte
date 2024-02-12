<script lang="ts" context="module">
  export function getParsedValueFromLocalStorage<T>(
    key: string,
    expectedType: string,
    defaultValue: T,
  ): T {
    const jsonString = localStorage.getItem(key);

    return getParsedValueFromJsonString(jsonString, expectedType, defaultValue);
  }

  export function getParsedValueFromSessionStorage<T>(
    key: string,
    expectedType: string,
    defaultValue: T,
  ): T {
    const jsonString = sessionStorage.getItem(key);

    return getParsedValueFromJsonString(jsonString, expectedType, defaultValue);
  }

  function getParsedValueFromJsonString<T>(
    jsonString: string | null,
    expectedType: string,
    defaultValue: T,
  ): T {
    if (!jsonString) return defaultValue;

    try {
      const parsedValue = JSON.parse(jsonString);
      return typeof parsedValue === expectedType ? parsedValue : defaultValue;
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
    $isListsOpened = getParsedValueFromSessionStorage("isListsOpened", "boolean", $isListsOpened);
    $isTodoOpened = getParsedValueFromSessionStorage("isTodoOpened", "boolean", $isTodoOpened);
    $itemToProcessId = getParsedValueFromSessionStorage(
      "itemToProcessId",
      "string",
      $itemToProcessId,
    );
    $newList = getParsedValueFromSessionStorage("newList", "string", $newList);
    $newTodo = getParsedValueFromSessionStorage("newTodo", "string", $newTodo);
    $openedMenuId = getParsedValueFromSessionStorage("openedMenuId", "string", $openedMenuId);

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
