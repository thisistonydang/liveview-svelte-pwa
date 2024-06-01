<script lang="ts" context="module">
  export type DeleteItem = (item: TodoList | TodoItem) => void;

  export type DndHandler = (
    event: CustomEvent,
    updateUi: (newItems: TodoList[] | TodoItem[]) => void,
  ) => void;

  export type UpdateItem = (newItem: TodoList | TodoItem) => void;
</script>

<script lang="ts">
  import { SOURCES, TRIGGERS } from "svelte-dnd-action";
  import * as Y from "yjs";

  import {
    isListsOpened,
    isTodoOpened,
    itemToProcessId,
    newList,
    newTodo,
    openedMenuId,
    selectedListId,
  } from "$stores/clientOnlyState";
  import { todoLists, todoItems, yTodoLists, yTodoItems, isTodoItem } from "$stores/crdtState";
  import { liveView } from "$stores/liveViewSocket";

  import { syncDocumentToServer } from "./StateManagement.svelte";
  import ConfirmDeletionModal from "./ConfirmDeletionModal.svelte";
  import ItemsContainer from "./ItemsContainer.svelte";
  import MoveTodoMenu from "./MoveTodoMenu.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import TodoCheckList from "./TodoCheckList.svelte";
  import TodoListSelector from "./TodoListSelector.svelte";

  import type { TodoList, TodoItem } from "$stores/crdtState";

  export let menuClass: string;
  export let isScrollPositionRestored: boolean;

  const confirmDeletionModalId = "confirm-deletion-modal-id";
  const moveTodoMenuId = "move-todo-menu-id";
  const flipDurationMs = 100;
  let dragDisabled = true;

  // Todo lists handlers ___________________________________________________________________________

  function addList() {
    const list = new Y.Map<string>();
    list.set("id", crypto.randomUUID());
    list.set("name", $newList);
    $yTodoLists.unshift([list]);

    $newList = "";

    syncDocumentToServer($liveView);
  }

  // Todo items handlers ___________________________________________________________________________

  function addTodo() {
    const todo = new Y.Map<string | boolean>();
    todo.set("id", crypto.randomUUID());
    todo.set("name", $newTodo);
    todo.set("completed", false);
    todo.set("listId", $selectedListId);
    $yTodoItems.unshift([todo]);

    $newTodo = "";

    syncDocumentToServer($liveView);
  }

  function toggleCompleted(itemId: string) {
    for (const yTodo of $yTodoItems) {
      if (yTodo.get("id") === itemId) {
        yTodo.set("completed", !yTodo.get("completed"));
        syncDocumentToServer($liveView);
        return;
      }
    }
  }

  /**
   * Move a todo item to a new list.
   */
  function moveTodo(itemToMove: TodoItem, newListId: string) {
    // Return if the itemToMove is already in the new list.
    if (itemToMove.listId === newListId) {
      return;
    }

    // Move itemToMove to the top of the new list.
    const index = $yTodoItems.toArray().findIndex((yTodo) => yTodo.get("id") === itemToMove.id);
    const todo = new Y.Map<string | boolean>();
    todo.set("id", itemToMove.id);
    todo.set("name", itemToMove.name);
    todo.set("completed", itemToMove.completed);
    todo.set("listId", newListId);

    $yTodoItems.doc.transact(() => {
      $yTodoItems.delete(index);
      $yTodoItems.unshift([todo]);
    });

    syncDocumentToServer($liveView);
  }

  // Shared handlers for both todo lists and todo items ____________________________________________

  const updateItem: UpdateItem = (newItem) => {
    if (isTodoItem(newItem)) {
      for (const yTodo of $yTodoItems) {
        if (yTodo.get("id") === newItem.id) {
          $yTodoItems.doc.transact(() => {
            yTodo.set("name", newItem.name);
            yTodo.set("completed", newItem.completed);
            yTodo.set("listId", newItem.listId);

            newItem.newName === undefined
              ? yTodo.delete("newName")
              : yTodo.set("newName", newItem.newName);

            newItem.isEditing === undefined
              ? yTodo.delete("isEditing")
              : yTodo.set("isEditing", newItem.isEditing);
          });

          syncDocumentToServer($liveView);
          return;
        }
      }
    } else {
      for (const yList of $yTodoLists) {
        if (yList.get("id") === newItem.id) {
          $yTodoLists.doc.transact(() => {
            yList.set("name", newItem.name);

            newItem.newName === undefined
              ? yList.delete("newName")
              : yList.set("newName", newItem.newName);

            newItem.isEditing === undefined
              ? yList.delete("isEditing")
              : yList.set("isEditing", newItem.isEditing);
          });

          syncDocumentToServer($liveView);
          return;
        }
      }
    }
  };

  const deleteItem: DeleteItem = (item) => {
    let index = 0;

    if (isTodoItem(item)) {
      for (const yTodo of $yTodoItems) {
        if (yTodo.get("id") === item.id) {
          $yTodoItems.delete(index);
          syncDocumentToServer($liveView);
          return;
        }
        index++;
      }
    } else {
      for (const yList of $yTodoLists) {
        if (yList.get("id") === item.id) {
          $yTodoLists.doc.transact(() => {
            $yTodoLists.delete(index);
            cleanOrphanedTodos(item.id);
          });

          syncDocumentToServer($liveView);
          return;
        }
        index++;
      }
    }
  };

  function cleanOrphanedTodos(listId: string) {
    const oldTodoListIds = $todoLists.map((list) => list.id);
    const newTodoListIds = oldTodoListIds.filter((id) => id !== listId);

    // NOTE: The index is tracked manually here because the delete
    // operation changes the array length.
    let index = 0;
    $yTodoItems.forEach((yMap) => {
      let yMapListId = yMap.get("listId");
      yMapListId = typeof yMapListId === "string" ? yMapListId : "";

      if (!newTodoListIds.includes(yMapListId)) {
        $yTodoItems.delete(index);
        return;
      }

      // Only increment index if the item is not deleted.
      index++;
    });
  }

  // Drag and drop handlers ________________________________________________________________________

  const handleConsider: DndHandler = (event, updateUiOnConsider) => {
    // Update the items list in the UI.
    const newItems = filterDuplicates(event.detail.items);
    updateUiOnConsider(newItems);

    // Ensure dragging is stopped on drag finish via keyboard.
    const { source, trigger } = event.detail.info;
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  };

  const handleFinalize: DndHandler = (event, updateUiOnFinalize) => {
    // Update the items list in the UI.
    // TODO: Is it necessary to check that the id is reset back from the
    // svelte-dnd-action placeholder id? If the id is not reset, then
    // it is possible to have duplicate ids which will crash the app.
    const newItems = filterDuplicates(event.detail.items);
    updateUiOnFinalize(newItems);

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    const { source } = event.detail.info;
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }

    // Save to server.
    syncDocumentToServer($liveView);
  };

  /**
   * Helper function to remove any items with duplicate ids from the items array.
   */
  function filterDuplicates(items: TodoList[] | TodoItem[]) {
    const ids: string[] = [];

    return items.filter((item) => {
      if (!ids.includes(item.id)) {
        ids.push(item.id);
        return true;
      }
      return false;
    });
  }

  /**
   * Handle keydown events for drag and drop.
   */
  function handleDragKeyDown(event: KeyboardEvent, itemId: string) {
    // Allow Enter and Space keys to start drag and drop.
    if ((event.key === "Enter" || event.key === " ") && dragDisabled) {
      dragDisabled = false;

      // Track which item is being dragged.
      $itemToProcessId = itemId;
    }
  }

  // Keep selected list name and items in sync with selected list id _______________________________

  function setSelectedListName(listId: string) {
    return $todoLists.find((list) => list.id === listId)?.name ?? "";
  }
  $: selectedListName = setSelectedListName($selectedListId);

  $: selectedListTodoItems = $todoItems.filter((item) => item.listId === $selectedListId);
  $: selectedListUncompletedItems = selectedListTodoItems.filter((item) => !item.completed);

  // Get itemToMove when $itemToProcessId changes __________________________________________________
  $: itemToMove = $todoItems.find((item) => item.id === $itemToProcessId);
</script>

{#if $itemToProcessId && $openedMenuId === confirmDeletionModalId}
  <ConfirmDeletionModal listId={$itemToProcessId} {menuClass} {deleteItem} />
{/if}

{#if itemToMove && $openedMenuId === moveTodoMenuId}
  <MoveTodoMenu {itemToMove} {menuClass} {moveTodo} />
{/if}

{#if $selectedListId}
  <NewItemForm
    addItemCallback={addTodo}
    bind:value={$newTodo}
    placeholder="Enter new item name"
    submitButtonText="Add"
    submitButtonTitle="Add item to list."
    {isScrollPositionRestored}
  />

  <ItemsContainer
    title={selectedListName}
    totalCount={selectedListTodoItems.length}
    uncompletedCount={selectedListUncompletedItems.length}
    bind:isDropdownOpened={$isTodoOpened}
    {isScrollPositionRestored}
  >
    <TodoCheckList
      title={selectedListName}
      items={selectedListTodoItems}
      {toggleCompleted}
      {updateItem}
      {deleteItem}
      {handleConsider}
      {handleFinalize}
      {handleDragKeyDown}
      bind:dragDisabled
      {flipDurationMs}
      {menuClass}
      {moveTodoMenuId}
      {isScrollPositionRestored}
    />
  </ItemsContainer>
{:else}
  <NewItemForm
    addItemCallback={addList}
    bind:value={$newList}
    placeholder="Enter new list name"
    submitButtonText="Create"
    submitButtonTitle="Create new list."
    {isScrollPositionRestored}
  />

  <ItemsContainer
    title="Lists"
    totalCount={$todoLists.length}
    bind:isDropdownOpened={$isListsOpened}
    {isScrollPositionRestored}
  >
    <TodoListSelector
      {updateItem}
      {deleteItem}
      {handleConsider}
      {handleFinalize}
      {handleDragKeyDown}
      bind:dragDisabled
      {flipDurationMs}
      {menuClass}
      {confirmDeletionModalId}
      {isScrollPositionRestored}
    />
  </ItemsContainer>
{/if}
