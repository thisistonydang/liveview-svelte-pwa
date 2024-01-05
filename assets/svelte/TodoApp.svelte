<script>
  import { get } from "svelte/store";
  import { fly } from "svelte/transition";
  import { SOURCES, TRIGGERS } from "svelte-dnd-action";

  import { isCompletedOpened, isTodoOpened, newTodo } from "../stores/clientOnlyState";
  import { completedItems, todoItems } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { syncClientToServer } from "./StateManagement.svelte";
  import TodoItemsContainer from "./TodoItemsContainer.svelte";

  /**
   * @typedef {Object} TodoItem
   * @property {string} id
   * @property {string} name
   */

  let error = "";
  let dragDisabled = true;

  function addItem() {
    for (const item of $todoItems) {
      if (item.name === $newTodo) {
        error = "Item already exists!";
        return;
      }
    }
    $todoItems = [{ id: crypto.randomUUID(), name: $newTodo }, ...$todoItems];
    $newTodo = "";
    syncClientToServer($todoItems, $completedItems, $liveView);
  }

  function deleteItem(itemsStore, item) {
    const newItems = get(itemsStore).filter((i) => i.id !== item.id);
    itemsStore.set(newItems);
    syncClientToServer($todoItems, $completedItems, $liveView);
  }

  function checkItem(item) {
    $todoItems = $todoItems.filter((i) => i.id !== item.id);
    $completedItems = [item, ...$completedItems];
    syncClientToServer($todoItems, $completedItems, $liveView);
  }

  function uncheckItem(item) {
    $completedItems = $completedItems.filter((i) => i.id !== item.id);
    $todoItems = [item, ...$todoItems];
    syncClientToServer($todoItems, $completedItems, $liveView);
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

    syncClientToServer($todoItems, $completedItems, $liveView);
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

<form on:submit|preventDefault={addItem} class="join my-2 w-full">
  <input
    type="text"
    placeholder="Type here"
    class="input input-bordered border-neutral w-full join-item"
    required
    bind:value={$newTodo}
    on:input={() => (error = "")}
  />
  <button class="btn btn-accent join-item border border-neutral">Add</button>
</form>
{#if error}
  <p class="text-error" in:fly={{ y: -10 }}>{error}</p>
{/if}

<TodoItemsContainer
  title="To Do"
  bind:isDropdownOpened={$isTodoOpened}
  items={$todoItems}
  itemsStore={todoItems}
  checkHandler={checkItem}
  {deleteItem}
  {handleConsider}
  {handleFinalize}
  bind:dragDisabled
  noItemsMessage="All done!"
/>

<TodoItemsContainer
  title="Completed"
  bind:isDropdownOpened={$isCompletedOpened}
  items={$completedItems}
  itemsStore={completedItems}
  checkHandler={uncheckItem}
  {deleteItem}
  {handleConsider}
  {handleFinalize}
  bind:dragDisabled
  noItemsMessage="No completed items."
/>
