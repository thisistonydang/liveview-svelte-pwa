<script lang="ts" context="module">
  import { get } from "svelte/store";
  import { fromUint8Array } from "js-base64";
  import type { Live } from "live_svelte";

  const doc = new Y.Doc();
  const clientDocumentUpdatedKey = "clientDocumentUpdated";

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
  let mounted = false;

</script>
