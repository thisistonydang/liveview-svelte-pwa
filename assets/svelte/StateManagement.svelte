<script context="module">
  import { get } from "svelte/store";

  /** Save new state to localStorage and notify server. */
  export function syncClientToServer(todoItems, completedItems, live) {
    const newClientState = {
      meta: { synced: false },
      timestamp: Date.now(),
      value: { todo: todoItems, completed: completedItems },
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
    live.pushEvent("client_state_updated", { clientState: newClientState });
  }
</script>

<script>
  import { onMount } from "svelte";
  import { completedItems, todoItems } from "../stores/crdtState";
  import { syncState } from "../stores/syncState";

  const CLIENT_STATE_KEY = "clientState";
  let mounted = false;

  function resetClientState(key) {
    const clientState = {
      meta: { synced: false },
      timestamp: 0,
      value: { todo: [], completed: [] },
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
        !Array.isArray(parsedValue.value?.completed)
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
    $todoItems = latestState.value.todo;
    $completedItems = latestState.value.completed;

    if (latestState.meta.synced) {
      $syncState = "Synced";
    } else {
      live.pushEvent("client_state_updated", { clientState: latestState });
      $syncState = "Not Synced";
    }
  }

  onMount(() => {
    live.pushEvent("request_server_state");
    mounted = true;
  });

  // Sync state whenever new server state is received.
  $: if (mounted) syncServerToClient(serverState, CLIENT_STATE_KEY);
</script>
