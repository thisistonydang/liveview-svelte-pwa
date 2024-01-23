<script context="module">
  import { get } from "svelte/store";

  import { selectedListId, urlHash } from "../stores/clientOnlyState";

  const CLIENT_STATE_KEY = "clientState";

  /** Save new state to localStorage and notify server. */
  export function syncClientToServer(todoItems, todoLists, live) {
    const newClientState = {
      meta: { synced: false },
      timestamp: Date.now(),
      value: { lists: todoLists, todos: todoItems },
    };
    localStorage.setItem(CLIENT_STATE_KEY, JSON.stringify(newClientState));

    // Each time state is updated, let user know that sync to server is in
    // progress. If the sync takes longer than 1 second, let user know that sync
    // failed.
    syncState.set("Syncing");
    setTimeout(() => {
      if (get(syncState) !== "Synced") {
        syncState.set("Not Synced");
      }
    }, 1000);

    // Send new client state to server
    live?.pushEvent("client_state_updated", { clientState: newClientState });
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { todoItems, todoLists } from "../stores/crdtState";
  import { liveView, serverState } from "../stores/liveViewSocket";
  import { syncState } from "../stores/syncState";

  let mounted = false;

  function resetClientState(key: string) {
    const clientState = {
      meta: { synced: false },
      timestamp: 0,
      value: { lists: [], todos: [] },
    };
    localStorage.setItem(key, JSON.stringify(clientState));

    return clientState;
  }

  function getClientState(key: string) {
    const value = localStorage.getItem(key);

    // If entry does not exist, create a new clientState object.
    if (!value) return resetClientState(key);

    try {
      const parsedValue = JSON.parse(value);

      // If parsed client state is invalid, create a new clientState object.
      // TODO: Add more validation checks.
      if (
        typeof parsedValue.meta?.synced !== "boolean" ||
        !["number", "undefined"].includes(typeof parsedValue.meta?.timestamp) ||
        typeof parsedValue.timestamp !== "number" ||
        !Array.isArray(parsedValue.value?.todos) ||
        !Array.isArray(parsedValue.value?.lists)
      ) {
        console.error("Invalid client state.", parsedValue);
        return resetClientState(key);
      }

      // If parsed client state is valid, return parsed value as clientState.
      return parsedValue;
    } catch (error) {
      console.error(error);
      return resetClientState(key);
    }
  }

  /**
   * Merge client and server state.
   * Last write wins based on timestamp. If timestamps are equal, server state wins.
   */
  function mergeState({ clientState, serverState }) {
    return clientState.timestamp > serverState.timestamp ? clientState : serverState;
  }

  function syncServerToClient(serverState, key: string) {
    const clientState = getClientState(key);
    const latestState = mergeState({ clientState, serverState });
    localStorage.setItem(key, JSON.stringify(latestState));

    // Set stores to match latest state.
    // Note: The check to see if todos/lists is an array is to cover the cases where
    // todos/lists is undefined due to legacy code.
    // TODO: Maybe remove this check in the future?
    $todoItems = Array.isArray(latestState.value.todos) ? latestState.value.todos : [];
    $todoLists = Array.isArray(latestState.value.lists) ? latestState.value.lists : [];

    if (latestState.meta.synced) {
      $syncState = "Synced";
    } else {
      $liveView?.pushEvent("client_state_updated", { clientState: latestState });
      $syncState = "Not Synced";
    }
  }

  /**
   * Keep $urlHash and $selectedListId in sync with the url.
   */
  function syncAppStateWithUrl() {
    const url = new URL(window.location.href);
    const hash = url.hash;

    switch (hash) {
      case "#about":
        $urlHash = "about";
        $selectedListId = "";
        history.replaceState({}, "", "/app");
        history.pushState({}, "", "/app#about");
        break;

      default:
        const listId = hash.replace("#", "");
        const list = $todoLists.find((list) => list.id === listId);
        if (list) {
          $urlHash = "listId";
          $selectedListId = listId;
          history.replaceState({}, "", "/app");
          history.pushState({}, "", `/app#${listId}`);
        } else {
          $urlHash = "";
          $selectedListId = "";
          history.replaceState({}, "", "/app");
        }
        break;
    }
  }

  onMount(() => {
    mounted = true;
  });

  // Sync state whenever new server state is received.
  $: if (mounted) syncServerToClient($serverState, CLIENT_STATE_KEY);

  // Sync selectedListId with url on app mount.
  // Note: This needs to happen after the first syncServerToClient call so that
  // $todoLists is populated.
  $: if (mounted) syncAppStateWithUrl();

  $: if (mounted) history.scrollRestoration = "auto";
</script>

<svelte:window on:popstate={syncAppStateWithUrl} />
