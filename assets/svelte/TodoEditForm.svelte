<script>
  import { get } from "svelte/store";
  import { fly } from "svelte/transition";

  import CheckSvgIconMicro from "lib/svg-icons/CheckSvgIconMicro.svelte";

  export let item;
  export let itemsStore;
  export let updateItem;

  let newName = item.newName;
  let error = "";

  function handleSubmit() {
    console.log("[handleSubmit] handling submit");

    // Trim whitespace.
    newName = newName.replace(/\s+/g, " ");

    // Check if new item name is empty string or unchanged.
    if (["", " ", item.name].includes(newName)) {
      updateItem(itemsStore, { id: item.id, name: item.name });
      return;
    }

    // Check new item name already exists.
    for (const item of get(itemsStore)) {
      if (newName.toLowerCase() === item.name.toLowerCase()) {
        error = "Item already exists!";
        return;
      }
    }

    updateItem(itemsStore, { id: item.id, name: newName });
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
    updateItem(itemsStore, { id: item.id, name: item.name, newName, isEditing: true });

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

<form class="w-full" on:submit|preventDefault={handleSubmit}>
  <div class="w-full join">
    <input
      use:focus
      type="text"
      class="input input-bordered border-neutral w-full join-item"
      bind:value={newName}
      on:input={handleInput}
      on:keydown={handleKeyDown}
    />

    <button class="btn btn-accent join-item border border-neutral" aria-label="Update item.">
      <CheckSvgIconMicro className="w-5 h-5" />
    </button>
  </div>

  {#if error}
    <p class="text-error mt-1 text-sm" in:fly={{ y: -10 }}>
      {error}
    </p>
  {/if}
</form>
