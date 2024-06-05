<script lang="ts" context="module">
  import { get } from "svelte/store";
  import { fromUint8Array } from "js-base64";

  import { useIsConnected } from "$lib/hooks/useIsConnected";

  import type { Live } from "live_svelte";

  const doc = new Y.Doc();
  const clientDocumentUpdatedKey = "clientDocumentUpdated";

  function getBase64Document() {
    const binaryDocument = Y.encodeStateAsUpdate(doc);
    const base64Document = fromUint8Array(binaryDocument);

    return base64Document;
  }

  /**
   * Let the user know that sync to server is in progress by showing the status
   * in the SyncStatusBadge. If the sync takes longer than 1 second, timeout and
   * set sync state to "Not Synced".
   */
  function notifyUserSyncingIsInProgress() {
    syncState.set("Syncing");

    setTimeout(() => {
      if (get(syncState) !== "Synced") {
        syncState.set("Not Synced");
      }
    }, 1000);
  }

  /**
   * Check if LiveView is disconnected and attempt reconnection if a connection
   * to the server is available.
   */
  export async function reconnectLiveViewIfDisconnected() {
    const connected = await useIsConnected({});

    if (!connected) {
      syncState.set("Not Synced");
      return;
    }

    const live = get(liveView);
    if (!live || live.__isDisconnected) {
      window.location.reload();
    }
  }

  function confirmSynced(response: { ok: boolean }) {
    if (response.ok) {
      syncState.set("Synced");
    }
  }

  export async function syncDocumentToServer(live: Live) {
    // Set the todoLists and todoItems stores so that the UI is updated.
    todoLists.set(get(yTodoLists).toJSON());
    todoItems.set(get(yTodoItems).toJSON());

    notifyUserSyncingIsInProgress();

    // Update clientDocumentUpdatedKey to to notify other tabs that the document has been updated.
    // This is used to sync the document state across different tabs when offline.
    localStorage.setItem(clientDocumentUpdatedKey, JSON.stringify(Date.now()));

    // Send new client document to server.
    live?.pushEvent("client_document_updated", { document: getBase64Document() }, confirmSynced);

    // In case the LiveView is disconnected and a connection to the server is
    // available, attempt reconnection of the LiveView in order to sync the
    // document state.
    reconnectLiveViewIfDisconnected();
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import { toUint8Array } from "js-base64";
  import { IndexeddbPersistence } from "y-indexeddb";
  import * as Y from "yjs";

  import { selectedListId, urlHash } from "$stores/clientOnlyState";
  import { todoLists, todoItems, yTodoLists, yTodoItems } from "$stores/crdtState";
  import { liveView, serverDocument } from "$stores/liveViewSocket";
  import { syncState } from "$stores/syncState";

  import { getParsedValueFromLocalStorage } from "./ClientOnlyStateManagement.svelte";
  import { indexedDBName } from "./DataClearer.svelte";

  import type { ServerDocument } from "$stores/liveViewSocket";

  export let isSyncedToIndexedDb: boolean;

  const stateMap = doc.getMap<Y.Array<Y.Map<string | boolean>>>();
  const syncStateKey = "syncState";
  let indexedDbProvider: IndexeddbPersistence;

  function syncWithIndexedDb() {
    indexedDbProvider = new IndexeddbPersistence(indexedDBName, doc);
    indexedDbProvider.on("synced", () => {
      // Sync stores with IndexedDB state.
      $yTodoLists = stateMap.get("lists");
      $yTodoItems = stateMap.get("todos");
      $todoLists = $yTodoLists ? $yTodoLists.toJSON() : [];
      $todoItems = $yTodoItems ? $yTodoItems.toJSON() : [];

      isSyncedToIndexedDb = true;
    });
  }

  function syncServerToClient({ event, document }: ServerDocument) {
    if (event === "mount") return;

    // If no document state exists on server, create a new document from client
    // state and save it to the server.
    if (!document) {
      // Create new Yjs arrays for lists and todos if they don't exist.
      if (!$yTodoLists && !$yTodoItems) {
        $yTodoLists = new Y.Array();
        stateMap.set("lists", $yTodoLists);

        $yTodoItems = new Y.Array();
        stateMap.set("todos", $yTodoItems);
      }

      // Send request to server to create new document from client state.
      $liveView.pushEvent(
        "create_server_document",
        { document: getBase64Document() },
        confirmSynced,
      );

      return;
    }

    // If document state exists on server, merge it with client state.
    Y.applyUpdate(doc, toUint8Array(document));
    $yTodoLists = stateMap.get("lists");
    $yTodoItems = stateMap.get("todos");
    $todoLists = $yTodoLists.toJSON();
    $todoItems = $yTodoItems.toJSON();

    // When coming back online, send state to server so it can be broadcasted.
    if (event === "request_server_document") {
      syncDocumentToServer($liveView);
    }

    // Update url if needed. This is for the case where an update deletes a
    // list that is currently being viewed.
    syncAppStateWithUrl();
  }

  // Get previous syncState from localStorage on app reloads.
  onMount(() => {
    const previousSyncState = getParsedValueFromLocalStorage(syncStateKey, "string", $syncState);
    $syncState = previousSyncState === "Syncing" ? "Not Synced" : previousSyncState;
  });

  onMount(() => {
    syncWithIndexedDb();
  });

  // Request server document after syncing with IndexedDB and ws connection is established.
  $: if (isSyncedToIndexedDb && $liveView) {
    $liveView.pushEvent("request_server_document");
  }

  // Sync server state to client whenever a new serverDocument is received.
  $: if (isSyncedToIndexedDb && $liveView) {
    syncServerToClient($serverDocument);
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

  // Sync urlHash and selectedListId with url on app start.
  // Note: This needs to happen after syncing to indexedDb
  // so that $todoLists is populated.
  $: if (isSyncedToIndexedDb) syncAppStateWithUrl();

  // Set scroll restoration so page nav via back/forward buttons works as expected.
  $: if (isSyncedToIndexedDb) history.scrollRestoration = "auto";

  // Keep syncState store in sync with localStorage to allow for the sync badge
  // to be synced across tabs when offline.
  $: if (isSyncedToIndexedDb) {
    localStorage.setItem(syncStateKey, JSON.stringify($syncState));
  }
</script>

<svelte:window
  on:popstate={syncAppStateWithUrl}
  on:storage={async ({ key, newValue }) => {
    // These storage events are used to sync state across tabs when offline.
    switch (key) {
      case clientDocumentUpdatedKey:
        // Disconnect and reconnect to indexedDbProvider to force re-syncing
        // IndexedDB state with app stores.
        // TODO: There is probably a better way to do this.
        await indexedDbProvider.destroy();
        syncWithIndexedDb();
        break;

      case syncStateKey:
        $syncState = JSON.parse(newValue);
        break;
    }
  }}
/>
