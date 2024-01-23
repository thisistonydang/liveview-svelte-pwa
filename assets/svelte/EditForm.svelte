<script>
  import { fly } from "svelte/transition";

  import { clickOutside } from "lib/actions/clickOutside";
  import CheckSvgIconMicro from "lib/svg-icons/CheckSvgIconMicro.svelte";

  import { openedMenuId, selectedListId } from "../stores/clientOnlyState";

  export let item;
  export let itemsStore;
  export let updateItem;
  export let menuClass;

  /** @type {string} */
  let newName = item.newName;
  let error = "";

  /**
   * Commit edits made to the item and close the edit form.
   */
  function commitEdits() {
    updateItem(itemsStore, {
      id: item.id,
      name: newName,
      completed: item.completed,
      list_id: item.list_id,
    });

    $openedMenuId = "";
  }

  /**
   * Discard edits made to the item and close the edit form.
   */
  function discardEdits() {
    updateItem(itemsStore, {
      id: item.id,
      name: item.name,
      completed: item.completed,
      list_id: item.list_id,
    });

    $openedMenuId = "";
  }

  function handleSubmit({ isClickedOutside } = { isClickedOutside: false }) {
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

    // Check if new item name already exists.
    for (const item of $itemsStore) {
      if (item.list_id) {
        if (item.list_id === $selectedListId && item.name.toLowerCase() === newName.toLowerCase()) {
          if (isClickedOutside) {
            discardEdits();
            return;
          }

          error = `"${newName}" already exists in the list!`;
          return;
        }
      } else {
        if (item.name.toLowerCase() === newName.toLowerCase()) {
          if (isClickedOutside) {
            discardEdits();
            return;
          }

          error = `A list named "${newName}" already exists!`;
          return;
        }
      }
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
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      newName = "";
      handleSubmit();
    }
  }

  function handleInput() {
    // Track the newName so that page refreshes don't reset the input value.
    updateItem(itemsStore, { ...item, newName });

    // Reset error message.
    error = "";
  }

  /**
   * Svelte action to focus the input element.
   */
  function focus(element) {
    element.focus();
  }
</script>

<form
  class="{menuClass} w-full"
  on:submit|preventDefault={handleSubmit}
  use:clickOutside={() => handleSubmit({ isClickedOutside: true })}
>
  <div class="w-full join">
    <input
      use:focus
      type="text"
      class="
        input input-bordered border-neutral w-full sm:join-item
        focus:outline-none focus:ring-1 focus:ring-accent focus:ring-inset
      "
      bind:value={newName}
      on:input={handleInput}
      on:keydown={handleKeyDown}
    />

    <button class="btn btn-accent join-item border border-neutral" aria-label="Update item.">
      <CheckSvgIconMicro className="w-5 h-5" />
    </button>
  </div>

  {#if error}
    <p style="word-break: break-word;" class="text-error mt-1 text-sm" in:fly={{ y: -10 }}>
      {error}
    </p>
  {/if}
</form>
