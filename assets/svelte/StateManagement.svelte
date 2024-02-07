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

  export let isSyncedToIndexedDb: boolean;

  const stateMap = doc.getMap<Y.Array<Y.Map<string | boolean>>>();
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


  onMount(() => {
    syncWithIndexedDb();
  });

  // Request server document after syncing with IndexedDB and ws connection is established.
  $: if (isSyncedToIndexedDb && $liveView) {
    $liveView.pushEvent("request_server_document");
  }

</script>
