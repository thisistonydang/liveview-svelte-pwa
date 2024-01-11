<script context="module">
  import { get } from "svelte/store";

  import { selectedListId } from "../stores/clientOnlyState";
  import { getParsedValue } from "./ClientOnlyStateManagement.svelte";

  /**
   * Make sure that selectedListId exists in todoLists, else set selectedListId to first list or "".
   *
   * @param {{id: string, name: string}[]} todoLists - Array of todo lists.
   */
  export function setSelectedListId(todoLists) {
    const listId = getParsedValue("selectedListId", "string", "");
    const listExists = Boolean(todoLists.find((list) => list.id === listId));
    if (listExists) {
      selectedListId.set(listId);
    } else {
      selectedListId.set(todoLists.length ? todoLists[0].id : "");
    }
  }

  /** Save new state to localStorage and notify server. */
  export function syncClientToServer(todoItems, todoLists, live) {
    const newClientState = {
      meta: { synced: false },
      timestamp: Date.now(),
      value: { todo: todoItems, lists: todoLists },
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

<script>
  import { onMount } from "svelte";
  import { todoItems, todoLists } from "../stores/crdtState";
  import { isSocketMounted, liveView, serverState } from "../stores/liveViewSocket";
  import { syncState } from "../stores/syncState";

  const CLIENT_STATE_KEY = "clientState";
  let mounted = false;

  function resetClientState(key) {
    const clientState = {
      meta: { synced: false },
      timestamp: 0,
      value: { todo: [], lists: [] },
    };
    localStorage.setItem(key, JSON.stringify(clientState));

    return clientState;
  }

  function getClientState(key) {
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
        !Array.isArray(parsedValue.value?.todo) ||
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

  function syncServerToClient(serverState, key) {
    const clientState = getClientState(key);
    const latestState = mergeState({ clientState, serverState });
    localStorage.setItem(key, JSON.stringify(latestState));

    // Set stores to match latest state.
    // Note: The check to see if todo/lists is an array is to cover the cases where
    // todo/lists is undefined due to legacy code.
    // TODO: Maybe remove this check in the future?
    $todoLists = Array.isArray(latestState.value.lists) ? latestState.value.lists : [];
    setSelectedListId($todoLists);

    $todoItems = Array.isArray(latestState.value.todo)
      ? latestState.value.todo.filter((item) => item.list_id === $selectedListId)
      : [];

    if (latestState.meta.synced) {
      $syncState = "Synced";
    } else {
      $liveView?.pushEvent("client_state_updated", { clientState: latestState });
      $syncState = "Not Synced";
    }
  }

  onMount(() => {
    mounted = true;
  });

  // Request latest server state when LiveView socket is mounted.
  $: if ($isSocketMounted) $liveView.pushEvent("request_server_state");

  // Sync state whenever new server state is received.
  $: if (mounted) syncServerToClient($serverState, CLIENT_STATE_KEY);

  // Update todoItems whenever selectedListId changes.
  function updateTodoItems(listId) {
    const allTodos = getClientState(CLIENT_STATE_KEY).value.todo;
    $todoItems = allTodos.filter((item) => item.list_id === listId);
  }
  $: if (mounted) updateTodoItems($selectedListId);
</script>
