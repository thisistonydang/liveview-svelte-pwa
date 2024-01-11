<script>
  import { get } from "svelte/store";
  import { SOURCES, TRIGGERS } from "svelte-dnd-action";
  import { isThemeMenuOpened } from "lib/theme-selector";

  import {
    activeTab,
    isAccountMenuOpened,
    isListsOpened,
    isTodoOpened,
    newList,
    newTodo,
    openedOptionsMenuId,
    selectedListId,
  } from "../stores/clientOnlyState";
  import { todoItems, todoLists } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { setSelectedListId, syncClientToServer } from "./StateManagement.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import ItemsContainer from "./ItemsContainer.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import NoListCard from "./NoListCard.svelte";
  import TodoCheckList from "./TodoCheckList.svelte";
  import TodoListSelector from "./TodoListSelector.svelte";

  const optionsMenuClass = "options-menu";
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
    $todoItems = [{ id: crypto.randomUUID(), name: $newTodo, completed: false }, ...$todoItems];
    $newTodo = "";
    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  function toggleCompleted(item) {
    $todoItems = $todoItems.map((i) => {
      if (i.id === item.id) {
        return { ...i, completed: !i.completed };
      }
      return i;
    });

    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  // Handlers for both todo lists and todo items ___________________________________________________

  function updateItem(itemsStore, newItem) {
    const newItems = get(itemsStore).map((item) => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return { id: item.id, name: item.name, completed: item.completed };
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
    $isThemeMenuOpened = false;
    $isAccountMenuOpened = false;
    $openedOptionsMenuId = "";
  }

  function handleDragKeyDown(e) {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled) {
      dragDisabled = false;
    }
  }

  // Keep selected list name and items in sync with selected list id _______________________________

  function setSelectedListName(listId) {
    return $todoLists.find((list) => list.id === listId)?.name ?? "";
  }
  $: selectedListName = setSelectedListName($selectedListId);

  function setSelectedListTodoItems(listId) {
    return $todoItems.filter((item) => item.list_id === listId);
  }
  $: selectedListTodoItems = setSelectedListTodoItems($selectedListId);
</script>

<ClickOutsideClassHandler
  className={optionsMenuClass}
  callbackFunction={() => ($openedOptionsMenuId = "")}
/>

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
        title="To Do"
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
        {optionsMenuClass}
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
      {toggleCompleted}
      {updateItem}
      {deleteItem}
      {handleConsider}
      {handleFinalize}
      bind:dragDisabled
      {handleStartDrag}
      {handleDragKeyDown}
      {flipDurationMs}
      noItemsMessage="No lists yet. Please create a list to get started."
      {optionsMenuClass}
    />
  </ItemsContainer>
{/if}
