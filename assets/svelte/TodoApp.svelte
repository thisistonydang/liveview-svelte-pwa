<script lang="ts">
  import { get } from "svelte/store";
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
  } from "../stores/clientOnlyState";
  import { todoLists, todoItems, yTodoLists, yTodoItems } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { syncDocumentToServer } from "./StateManagement.svelte";
  import ConfirmDeletionModal from "./ConfirmDeletionModal.svelte";
  import ItemsContainer from "./ItemsContainer.svelte";
  import MoveTodoMenu from "./MoveTodoMenu.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import TodoCheckList from "./TodoCheckList.svelte";
  import TodoListSelector from "./TodoListSelector.svelte";

  export let menuClass: string;

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
    todo.set("list_id", $selectedListId);
    $yTodoItems.unshift([todo]);

    $newTodo = "";

    syncDocumentToServer($liveView);
  }

  function toggleCompleted(itemId: string) {
    // TODO: Test if toArray + findIndex is faster than for loop.
    for (const yMap of $yTodoItems) {
      if (yMap.get("id") === itemId) {
        yMap.set("completed", !yMap.get("completed"));
        syncDocumentToServer($liveView);
        return;
      }
    }
  }

  /**
   * Move a todo item to a new list.
   *
   * Returns "ok" if the item was moved successfully, otherwise returns "error".
   */
  function moveTodo(itemToMove: TodoItem, newListId: string): "ok" | "error" {
    // Return "ok" if the itemToMove is already in the new list.
    if (itemToMove.list_id === newListId) {
      return "ok";
    }

    // Return "error" if the itemToMove name already exists in the new list.
    const itemsInNewList = $todoItems.filter((item) => item.list_id === newListId);
    for (const item of itemsInNewList) {
      if (item.name.toLowerCase() === itemToMove.name.toLowerCase()) {
        return "error";
      }
    }

    // Move itemToMove to the top of the new list.
    const index = $yTodoItems.toArray().findIndex((yMap) => yMap.get("id") === itemToMove.id);
    const todo = new Y.Map<string | boolean>();
    todo.set("id", itemToMove.id);
    todo.set("name", itemToMove.name);
    todo.set("completed", itemToMove.completed);
    todo.set("list_id", newListId);

    $yTodoItems.doc.transact(() => {
      $yTodoItems.delete(index);
      $yTodoItems.unshift([todo]);
    });

    syncDocumentToServer($liveView);

    return "ok";
  }

  // Shared handlers for both todo lists and todo items ____________________________________________

  function updateItem(yItemStore, newItem) {
    get(yItemStore).forEach((yMap) => {
      if (yMap.get("id") === newItem.id) {
        yMap.set("name", newItem.name);

        newItem.completed === undefined
          ? yMap.delete("completed")
          : yMap.set("completed", newItem.completed);

        newItem.list_id === undefined
          ? yMap.delete("list_id")
          : yMap.set("list_id", newItem.list_id);

        newItem.newName === undefined
          ? yMap.delete("newName")
          : yMap.set("newName", newItem.newName);

        newItem.isEditing === undefined
          ? yMap.delete("isEditing")
          : yMap.set("isEditing", newItem.isEditing);
      } else {
        yMap.delete("newName");
        yMap.delete("isEditing");
      }
    });

    syncDocumentToServer($liveView);
  }

  function deleteItem(yItemsStore: Writable<YArray<YMap<string | boolean>>>, itemId: string) {
    const yArray = get(yItemsStore);
    let index = 0;

    for (const yMap of yArray) {
      if (yMap.get("id") === itemId) {
        // If a list is being deleted, clean up orphaned todos.
        if (yMap.get("list_id") === undefined) {
          let listId = yMap.get("id");
          listId = typeof listId === "string" ? listId : "";
          cleanOrphanedTodos(listId);
        }

        // Delete the item from the array.
        yArray.delete(index);

        // Save to server.
        syncDocumentToServer($liveView);

        return;
      }

      index++;
    }
  }

  function cleanOrphanedTodos(listId) {
    const oldTodoListIds = $todoLists.map((list) => list.id);
    const newTodoListIds = oldTodoListIds.filter((id) => id !== listId);

    // NOTE: The index is tracked manually here because the delete
    // operation changes the array length.
    let index = 0;
    $yTodoItems.forEach((yMap) => {
      if (!newTodoListIds.includes(yMap.get("list_id"))) {
        $yTodoItems.delete(index);
        return;
      }

      // Only increment index if the item is not deleted.
      index++;
    });
  }

  // Drag and drop handlers ________________________________________________________________________

  function handleConsider(event, updateUiOnConsider) {
    // Update the items list in the UI.
    const newItems = filterDuplicates(event.detail.items);
    updateUiOnConsider(newItems);

    // Ensure dragging is stopped on drag finish via keyboard.
    const { source, trigger } = event.detail.info;
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }

  function handleFinalize(event, updateUiOnFinalize) {
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
  }

  /**
   * Helper function to remove any items with duplicate ids from the items array.
   *
   * @param {{id: string;}[]} items
   */
  function filterDuplicates(items) {
    /** @type {string[]} */
    const ids = [];

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
   *
   * @param {KeyboardEvent} event
   * @param {string} itemId
   */
  function handleDragKeyDown(event, itemId) {
    // Allow Enter and Space keys to start drag and drop.
    if ((event.key === "Enter" || event.key === " ") && dragDisabled) {
      dragDisabled = false;

      // Track which item is being dragged.
      $itemToProcessId = itemId;
    }
  }

  // Keep selected list name and items in sync with selected list id _______________________________

  function setSelectedListName(listId) {
    return $todoLists.find((list) => list.id === listId)?.name ?? "";
  }
  $: selectedListName = setSelectedListName($selectedListId);

  $: selectedListTodoItems = $todoItems.filter((item) => item.list_id === $selectedListId);
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
    store={todoItems}
    addItemCallback={addTodo}
    bind:value={$newTodo}
    placeholder="Enter new item name"
    submitButtonText="Add"
    submitButtonTitle="Add item to list."
  />

  <ItemsContainer
    title={selectedListName}
    totalCount={selectedListTodoItems.length}
    uncompletedCount={selectedListUncompletedItems.length}
    bind:isDropdownOpened={$isTodoOpened}
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
    />
  </ItemsContainer>
{:else}
  <NewItemForm
    store={todoLists}
    addItemCallback={addList}
    bind:value={$newList}
    placeholder="Enter new list name"
    submitButtonText="Create"
    submitButtonTitle="Create new list."
  />

  <ItemsContainer
    title="Lists"
    totalCount={$todoLists.length}
    bind:isDropdownOpened={$isListsOpened}
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
    />
  </ItemsContainer>
{/if}
