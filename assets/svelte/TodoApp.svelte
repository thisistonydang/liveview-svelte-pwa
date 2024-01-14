<script>
  import { get } from "svelte/store";
  import { SOURCES, TRIGGERS } from "svelte-dnd-action";

  import {
    activeTab,
    isListsOpened,
    isTodoOpened,
    newList,
    newTodo,
    openedMenuId,
    selectedListId,
  } from "../stores/clientOnlyState";
  import { todoItems, todoLists } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { setSelectedListId, syncClientToServer } from "./StateManagement.svelte";
  import ItemsContainer from "./ItemsContainer.svelte";
  import MoveTodoMenu from "./MoveTodoMenu.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import NoListCard from "./NoListCard.svelte";
  import TodoCheckList from "./TodoCheckList.svelte";
  import TodoListSelector from "./TodoListSelector.svelte";

  /** @type {string} */
  export let menuClass;

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
   * @param {string} itemId
   * @param {string} newListId
   */
  function moveTodo(itemId, newListId) {
    $todoItems = $todoItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, list_id: newListId };
      }
      return item;
    });

    syncClientToServer($todoItems, $todoLists, $liveView);
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

  function deleteItem(itemsStore, item) {
    const newItems = get(itemsStore).filter((i) => i.id !== item.id);
    itemsStore.set(newItems);

    // If the deleted item is the selected list, update selectedListId store.
    // TODO: This can probably be optimized to not run every time an item is deleted.
    setSelectedListId($todoLists);

    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  // Drag and drop handlers ________________________________________________________________________

  function handleConsider(event, itemsStore) {
    const newItems = filterDuplicates(event.detail.items);
    const { source, trigger } = event.detail.info;

    itemsStore.set(newItems);

    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }

  function handleFinalize(event, itemsStore) {
    const newItems = filterDuplicates(event.detail.items);
    const { source } = event.detail.info;

    // TODO: Is it necessary to check that the id is reset back from the
    // svelte-dnd-action placeholder id? If the id is not reset, then
    // it is possible to have duplicate ids which will crash the app.

    itemsStore.set(newItems);

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }

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

  function handleStartDrag(event) {
    // Preventing default to prevent lag on touch devices (because of the
    // browser checking for screen scrolling).
    event.preventDefault();
    dragDisabled = false;
    $openedMenuId = "";
  }

  function handleDragKeyDown(event) {
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
</script>

<MoveTodoMenu {menuClass} {moveTodoMenuId} {moveTodo} />

{#if $activeTab === "To-Do"}
  {#if $selectedListId}
    <NewItemForm
      store={todoItems}
      addItemCallback={addTodo}
      bind:value={$newTodo}
      placeholder="Enter to-do item"
      submitButtonText="Add"
    />

    <ItemsContainer
      title={selectedListName}
      length={selectedListTodoItems.length}
      bind:isDropdownOpened={$isTodoOpened}
    >
      <TodoCheckList
        title={selectedListName}
        items={selectedListTodoItems}
        itemsStore={todoItems}
        {toggleCompleted}
        {updateItem}
        {deleteItem}
        {handleConsider}
        {handleFinalize}
        bind:dragDisabled
        {handleStartDrag}
        {handleDragKeyDown}
        {flipDurationMs}
        noItemsMessage="All done!"
        {menuClass}
        {moveTodoMenuId}
      />
    </ItemsContainer>
  {:else}
    <NoListCard />
  {/if}
{:else if $activeTab === "Lists"}
  <NewItemForm
    store={todoLists}
    addItemCallback={addList}
    bind:value={$newList}
    placeholder="Enter new list name"
    submitButtonText="Create"
  />

  <ItemsContainer title="Lists" length={$todoLists.length} bind:isDropdownOpened={$isListsOpened}>
    <TodoListSelector
      title="Lists"
      itemsStore={todoLists}
      {updateItem}
      {deleteItem}
      {handleConsider}
      {handleFinalize}
      bind:dragDisabled
      {handleStartDrag}
      {handleDragKeyDown}
      {flipDurationMs}
      noItemsMessage="No lists yet. Please create a list to get started."
      {menuClass}
    />
  </ItemsContainer>
{/if}
