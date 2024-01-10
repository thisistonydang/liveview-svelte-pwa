<script>
  import { get } from "svelte/store";
  import { SOURCES, TRIGGERS } from "svelte-dnd-action";

  import { isTodoOpened, newTodo, openedOptionsMenuId } from "../stores/clientOnlyState";
  import { todoItems } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { syncClientToServer } from "./StateManagement.svelte";
  import ClickOutsideClassHandler from "./ClickOutsideClassHandler.svelte";
  import NewItemForm from "./NewItemForm.svelte";
  import TodoItemsContainer from "./TodoItemsContainer.svelte";

  /**
   * @typedef {Object} TodoItem
   * @property {string} id
   * @property {string} name
   */

  const todoOptionsMenuClass = "todo-options-menu";
  let error = "";
  let dragDisabled = true;

  function addItem() {
    // Trim whitespace.
    $newTodo = $newTodo.trim().replace(/\s+/g, " ");
    $newTodo = $newTodo === " " ? "" : $newTodo;

    // Check if empty string.
    if ($newTodo === "") {
      error = "Item cannot be empty!";
      return;
    }

    // Check if item already exists.
    for (const item of $todoItems) {
      if (item.name.toLowerCase() === $newTodo.toLowerCase()) {
        error = "Item already exists!";
        return;
      }
    }

    $todoItems = [{ id: crypto.randomUUID(), name: $newTodo, completed: false }, ...$todoItems];
    $newTodo = "";
    syncClientToServer($todoItems, $liveView);
  }

  function updateItem(itemsStore, newItem) {
    const newItems = get(itemsStore).map((item) => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return { id: item.id, name: item.name, completed: item.completed };
    });

    itemsStore.set(newItems);
    syncClientToServer($todoItems, $liveView);
  }

  function deleteItem(itemsStore, item) {
    const newItems = get(itemsStore).filter((i) => i.id !== item.id);
    itemsStore.set(newItems);
    syncClientToServer($todoItems, $liveView);
  }

  function toggleCompleted(item) {
    $todoItems = $todoItems.map((i) => {
      if (i.id === item.id) {
        return { ...i, completed: !i.completed };
      }
      return i;
    });

    syncClientToServer($todoItems, $liveView);
  }

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

    syncClientToServer($todoItems, $liveView);
  }

  /**
   * Helper function to remove any items with duplicate ids from the items array.
   *
   * @param {TodoItem[]} items
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

<NewItemForm
  submitHandler={addItem}
  bind:value={$newTodo}
  placeholder="Enter to-do item"
  submitButtonText="Add"
  bind:error
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
