<script lang="ts">
  import { fly } from "svelte/transition";
  import { Check } from "lucide-svelte";

  import { focusTrap } from "$lib/actions/focusTrap";
  import { clickOutside } from "$lib/actions/clickOutside";

  import { openedMenuId } from "$stores/clientOnlyState";
  import { isTodoItem } from "$stores/crdtState";

  import type { TodoList, TodoItem } from "$stores/crdtState";
  import type { UpdateItem } from "./TodoApp.svelte";

  export let item: TodoList | TodoItem;
  export let updateItem: UpdateItem;
  export let menuClass: string;

  let newName = item.newName;
  let error = "";

  /**
   * Commit edits made to the item and close the edit form.
   */
  function commitEdits() {
    if (isTodoItem(item)) {
      updateItem({
        id: item.id,
        name: newName,
        completed: item.completed,
        listId: item.listId,
      });
    } else {
      updateItem({
        id: item.id,
        name: newName,
      });
    }

    $openedMenuId = "";
  }

  /**
   * Discard edits made to the item and close the edit form.
   */
  function discardEdits() {
    if (isTodoItem(item)) {
      updateItem({
        id: item.id,
        name: item.name,
        completed: item.completed,
        listId: item.listId,
      });
    } else {
      updateItem({
        id: item.id,
        name: item.name,
      });
    }

    $openedMenuId = "";
  }

  function handleSubmit() {
    // Trim whitespace.
    newName = newName.replace(/\s+/g, " ").trim();

    // Check if new item name is empty string or unchanged.
    if (["", item.name].includes(newName)) {
      discardEdits();
      return;
    }

    // Check if new item name is a change in casing of the original name.
    if (item.name.toLowerCase() === newName.toLowerCase()) {
      commitEdits();
      return;
    }

    // Check if string is too long.
    if (newName.length > 500) {
      error = "Cannot be over 500 characters!";
      return;
    }

    commitEdits();
  }

  /**
   * Allow the user to cancel the edit by pressing the escape key.
   */
  function handleEscape() {
    newName = "";
    handleSubmit();
  }

  function handleInput() {
    // Track the newName so that page refreshes don't reset the input value.
    updateItem({ ...item, newName });

    // Reset error message.
    error = "";
  }
</script>

<form
  class="{menuClass} w-full"
  on:submit|preventDefault={handleSubmit}
  use:clickOutside={handleSubmit}
  use:focusTrap={{
    focusFirstElement: true,
    onEscape: handleEscape,
  }}
>
  <div class="w-full join">
    <input
      data-focusindex="0"
      type="text"
      class="
        input input-bordered border-neutral w-full join-item
        focus:outline-none focus:ring-1 focus:ring-accent focus:ring-inset
      "
      bind:value={newName}
      on:input={handleInput}
    />

    <button
      data-focusindex="1"
      class="btn btn-accent join-item border border-neutral"
      aria-label="Update item."
    >
      <Check class="w-5 h-5" />
    </button>
  </div>

  {#if error}
    <p style="word-break: break-word;" class="text-error mt-1 text-sm" in:fly={{ y: -10 }}>
      {error}
    </p>
  {/if}
</form>
