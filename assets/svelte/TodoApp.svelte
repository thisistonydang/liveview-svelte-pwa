<script>
  import { get } from "svelte/store";
  import { SOURCES, TRIGGERS } from "svelte-dnd-action";

  import {
    isListsOpened,
    isTodoOpened,
    newList,
    newTodo,
    openedOptionsMenuId,
  } from "../stores/clientOnlyState";
  import { activeTab } from "../stores/clientOnlyState";
  import { todoItems, todoLists } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { syncClientToServer } from "./StateManagement.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import TodoItemsContainer from "./TodoItemsContainer.svelte";

  const todoOptionsMenuClass = "todo-options-menu";
  let dragDisabled = true;

  // TodoLists Handlers ____________________________________________________________________________

  // TodoItems Handlers ____________________________________________________________________________

  function addTodo() {
    $todoItems = [{ id: crypto.randomUUID(), name: $newTodo, completed: false }, ...$todoItems];
    $newTodo = "";
    syncClientToServer($todoItems, $todoLists, $liveView);
  }

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

  function toggleCompleted(item) {
    $todoItems = $todoItems.map((i) => {
      if (i.id === item.id) {
        return { ...i, completed: !i.completed };
      }
      return i;
    });

    syncClientToServer($todoItems, $todoLists, $liveView);
  }

  // Drag and Drop Handlers ________________________________________________________________________

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
</script>

<ClickOutsideClassHandler
  className={todoOptionsMenuClass}
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
    items={$todoItems}
    itemsStore={todoItems}
    {toggleCompleted}
    {updateItem}
    {deleteItem}
    {handleConsider}
    {handleFinalize}
    bind:dragDisabled
    noItemsMessage="All done!"
    {todoOptionsMenuClass}
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
    items={$todoItems}
    itemsStore={todoItems}
    {toggleCompleted}
    {updateItem}
    {deleteItem}
    {handleConsider}
    {handleFinalize}
    bind:dragDisabled
    noItemsMessage="All done!"
    {todoOptionsMenuClass}
  />
{/if}
