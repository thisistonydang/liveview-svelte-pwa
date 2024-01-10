<script>
  import { get } from "svelte/store";
  import { fly } from "svelte/transition";

  import { clickOutside } from "lib/actions/clickOutside";
  import CheckSvgIconMicro from "lib/svg-icons/CheckSvgIconMicro.svelte";

  export let item;
  export let itemsStore;
  export let updateItem;

  /** @type {string} */
  let newName = item.newName;
  let error = "";

  function handleSubmit() {
    // Trim whitespace.
    newName = newName.replace(/\s+/g, " ").trim();

    // Check if new item name is empty string or unchanged.
    if (["", " ", item.name].includes(newName)) {
      updateItem(itemsStore, { id: item.id, name: item.name, completed: item.completed });
      return;
    }

    // Check new item name already exists.
    for (const item of get(itemsStore)) {
      if (newName.toLowerCase() === item.name.toLowerCase()) {
        error = "Item already exists!";
        return;
      }
    }

    updateItem(itemsStore, { id: item.id, name: newName, completed: item.completed });
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

<form class="w-full" on:submit|preventDefault={handleSubmit} use:clickOutside={handleSubmit}>
  <div class="w-full join">
    <input
      use:focus
      type="text"
      class="input input-bordered border-neutral w-full sm:join-item"
      bind:value={newName}
      on:input={handleInput}
      on:keydown={handleKeyDown}
    />

    <button
      class="btn btn-accent join-item border border-neutral hidden sm:block"
      aria-label="Update item."
    >
      <CheckSvgIconMicro className="w-5 h-5" />
    </button>
  </div>

  {#if error}
    <p class="text-error mt-1 text-sm" in:fly={{ y: -10 }}>
      {error}
    </p>
  {/if}
</form>
