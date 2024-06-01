<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { ChevronRight } from "lucide-svelte";
  import { dndzone } from "svelte-dnd-action";
  import * as Y from "yjs";

  import { onKeydown } from "$lib/actions/onKeydown";
  import { useHasTouchScreen } from "$lib/hooks/useHasTouchScreen";

  import { itemToProcessId, openedMenuId, selectedListId, urlHash } from "$stores/clientOnlyState";
  import { todoLists, todoItems, yTodoLists } from "$stores/crdtState";

  import DragHandle from "./DragHandle.svelte";
  import EditForm from "./EditForm.svelte";
  import OptionsMenu from "./OptionsMenu.svelte";

  import type { TodoList } from "$stores/crdtState";
  import type { DeleteItem, DndHandler, UpdateItem } from "./TodoApp.svelte";

  export let updateItem: UpdateItem;
  export let deleteItem: DeleteItem;
  export let handleConsider: DndHandler;
  export let handleFinalize: DndHandler;
  export let handleDragKeyDown: (event: KeyboardEvent, itemId: string) => void;
  export let dragDisabled: boolean;
  export let flipDurationMs: number;
  export let menuClass: string;
  export let confirmDeletionModalId: string;
  export let isScrollPositionRestored: boolean;

  const hasTouchScreen = useHasTouchScreen();

  function updateUiOnConsider(newItems: TodoList[]) {
    $todoLists = newItems;
  }

  function updateUiOnFinalize(newItems: TodoList[]) {
    const oldIndex = $yTodoLists.toArray().findIndex((yMap) => yMap.get("id") === $itemToProcessId);

    const oldList = $yTodoLists.get(oldIndex);
    const newList = new Y.Map<string>();

    let oldListId = oldList.get("id");
    if (typeof oldListId !== "string") {
      throw new Error("The list ID must be a string.");
    }

    let oldListName = oldList.get("name");
    if (typeof oldListName !== "string") {
      throw new Error("The list name must be a string.");
    }

    newList.set("id", oldListId);
    newList.set("name", oldListName);

    $yTodoLists.doc.transact(() => {
      $yTodoLists.delete(oldIndex);

      // Move the list to the new position.
      const index = newItems.findIndex((list) => list.id === $itemToProcessId);
      $yTodoLists.insert(index, [newList]);
    });
  }
</script>

<ul
  class="
    min-h-[40px] rounded-lg
    focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
  "
  style:visibility={isScrollPositionRestored ? "visible" : "hidden"}
  aria-label="Lists"
  use:dndzone={{
    items: $todoLists,
    flipDurationMs,
    dragDisabled,
    morphDisabled: true,
    dropTargetStyle: {},
    dropTargetClasses: ["border-2", "border-dashed", "rounded-lg", "border-accent"],
  }}
  on:consider={(event) => handleConsider(event, updateUiOnConsider)}
  on:finalize={(event) => handleFinalize(event, updateUiOnFinalize)}
>
  {#each $todoLists as list (list.id)}
    {@const listItems = $todoItems.filter((item) => item.listId === list.id)}
    {@const uncompletedItems = listItems.filter((item) => !item.completed)}
    <li
      class="
        flex items-center justify-between rounded-lg
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      aria-label={list.name}
      animate:flip={{ duration: flipDurationMs }}
      use:onKeydown={(event) => handleDragKeyDown(event, list.id)}
    >
      {#if list.isEditing}
        <EditForm item={list} {updateItem} {menuClass} />
      {:else}
        <button
          title="Click to view list."
          class="
            flex items-center gap-1 grow px-2 py-1.5 mr-5 rounded-lg
            text-lg text-left active:bg-base-300
            focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
          "
          class:pointer-events-none={$openedMenuId}
          class:hover:bg-base-200={!hasTouchScreen}
          on:click={() => {
            $urlHash = "listId";
            $selectedListId = list.id;
            history.pushState({}, "", `/app#${list.id}`);
            window.scrollTo(0, 0);
          }}
        >
          <span style="word-break: break-word;">
            {list.name}

            <span class="badge badge-xs transition-none p-2">
              {uncompletedItems.length} / {listItems.length}
            </span>
          </span>

          <ChevronRight class="shrink-0 w-4 h-4" />
        </button>

        <div class="flex gap-1">
          <OptionsMenu item={list} {updateItem} {deleteItem} {menuClass} {confirmDeletionModalId} />

          <DragHandle bind:dragDisabled itemId={list.id} />
        </div>
      {/if}
    </li>
  {:else}
    <li
      class="
        flex items-center h-10 px-2 rounded-lg
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      in:fade={{ delay: 250 }}
    >
      No lists yet. Please create a list to get started.
    </li>
  {/each}
</ul>
