<script lang="ts" context="module">
  import { get } from "svelte/store";
  import { fromUint8Array } from "js-base64";
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

  export function syncDocumentToServer(live: Live) {
    // Set the todoLists and todoItems stores so that the UI is updated.
    todoLists.set(get(yTodoLists).toJSON());
    todoItems.set(get(yTodoItems).toJSON());

    notifyUserSyncingIsInProgress();

    // Update clientDocumentUpdatedKey to to notify other tabs that the document has been updated.
    // This is used to sync the document state across different tabs when offline.
    localStorage.setItem(clientDocumentUpdatedKey, JSON.stringify(Date.now()));

    // Send new client document to server.
    live?.pushEvent("client_document_updated", { document: getBase64Document() });
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

  import { indexedDBName } from "./DataClearer.svelte";

  import type { ServerDocument } from "./LiveViewSocket.svelte";

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
  }

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
