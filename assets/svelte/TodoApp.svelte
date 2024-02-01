<script>
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

  import ConfirmDeletionModal from "./ConfirmDeletionModal.svelte";
  import ItemsContainer from "./ItemsContainer.svelte";
  import MoveTodoMenu from "./MoveTodoMenu.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import TodoCheckList from "./TodoCheckList.svelte";
  import TodoListSelector from "./TodoListSelector.svelte";

  /**
   * @typedef {Object} TodoItem
   * @property {string} id
   * @property {string} name
   * @property {boolean} completed
   * @property {string} list_id
   */

  /** @type {string} */
  export let menuClass;

  const confirmDeletionModalId = "confirm-deletion-modal-id";
  const moveTodoMenuId = "move-todo-menu-id";
  const flipDurationMs = 100;
  let dragDisabled = true;

  // Todo lists handlers ___________________________________________________________________________

  function addList() {
    $todoLists = [{ id: crypto.randomUUID(), name: $newList }, ...$todoLists];
    $newList = "";
    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  // Todo items handlers ___________________________________________________________________________

  function addTodo() {
    $todoItems = [
      { id: crypto.randomUUID(), name: $newTodo, completed: false, list_id: $selectedListId },
      ...$todoItems,
    ];
    $newTodo = "";
    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  /**
   * Toggle the completed status of a todo item.
   * @param {string} itemId
   */
  function toggleCompleted(itemId) {
    $todoItems = $todoItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  /**
   * Move a todo item to a new list.
   * @param {TodoItem} itemToMove
   * @param {string} newListId
   * @returns {"ok" | "error"} Return "ok" if the item was moved successfully, otherwise return "error".
   */
  function moveTodo(itemToMove, newListId) {
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
    const newTodoItems = $todoItems.filter((item) => item.id !== itemToMove.id);
    $todoItems = [{ ...itemToMove, list_id: newListId }, ...newTodoItems];

    syncClientToServer($todoItems, $todoLists, $liveView);

    return "ok";
  }

  // Handlers for both todo lists and todo items ___________________________________________________

  function updateItem(itemsStore, newItem) {
    const newItems = get(itemsStore).map((item) => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return { id: item.id, name: item.name, completed: item.completed, list_id: item.list_id };
    });

    itemsStore.set(newItems);
    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  function deleteItem(itemsStore, itemId) {
    const newItems = get(itemsStore).filter((item) => item.id !== itemId);
    itemsStore.set(newItems);

    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  // Drag and drop handlers ________________________________________________________________________

  function handleConsider(event, updateUi) {
    // Update the items list in the UI.
    const newItems = filterDuplicates(event.detail.items);
    updateUi(newItems);

    // Ensure dragging is stopped on drag finish via keyboard
    const { source, trigger } = event.detail.info;
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }

  function handleFinalize(event, updateUi) {
    // Update the items list in the UI.
    // TODO: Is it necessary to check that the id is reset back from the
    // svelte-dnd-action placeholder id? If the id is not reset, then
    // it is possible to have duplicate ids which will crash the app.
    const newItems = filterDuplicates(event.detail.items);
    updateUi(newItems);

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    const { source } = event.detail.info;
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }

    // Save to server.
    syncClientToServer($todoItems, $todoLists, $liveView);
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
   */
  function handleDragKeyDown(event) {
    // Allow Enter and Space keys to start drag and drop.
    if ((event.key === "Enter" || event.key === " ") && dragDisabled) {
      dragDisabled = false;
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
