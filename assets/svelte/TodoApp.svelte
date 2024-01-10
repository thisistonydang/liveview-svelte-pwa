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
  } from "../stores/clientOnlyState";
  import { todoItems, todoLists } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { syncClientToServer } from "./StateManagement.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import TodoItemsContainer from "./TodoItemsContainer.svelte";

  const optionsMenuClass = "options-menu";
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
</script>

<ClickOutsideClassHandler
  className={optionsMenuClass}
  callbackFunction={() => ($openedOptionsMenuId = "")}
/>

{#if $activeTab === "To-Do"}
  <NewItemForm
    store={todoItems}
    addItemCallback={addTodo}
    bind:value={$newTodo}
    placeholder="Enter to-do item"
    submitButtonText="Add"
  />

  <TodoItemsContainer
    title="To Do"
    bind:isDropdownOpened={$isTodoOpened}
    itemsStore={todoItems}
    {toggleCompleted}
    {updateItem}
    {deleteItem}
    {handleConsider}
    {handleFinalize}
    bind:dragDisabled
    {handleStartDrag}
    noItemsMessage="All done!"
    {optionsMenuClass}
  />
{:else if $activeTab === "Lists"}
  <NewItemForm
    store={todoLists}
    addItemCallback={addList}
    bind:value={$newList}
    placeholder="Enter new list name"
    submitButtonText="Create"
  />

  <TodoItemsContainer
    title="Lists"
    bind:isDropdownOpened={$isListsOpened}
    itemsStore={todoLists}
    {toggleCompleted}
    {updateItem}
    {deleteItem}
    {handleConsider}
    {handleFinalize}
    bind:dragDisabled
    {handleStartDrag}
    noItemsMessage="All done!"
    {optionsMenuClass}
  />
{/if}
