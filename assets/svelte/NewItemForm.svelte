<script>
  import { fly } from "svelte/transition";

  export let store;

  /** @type {() => void}*/
  export let addItemCallback;

  /** @type {string} */
  export let value;

  /** @type {string} */
  export let placeholder;

  /** @type {string} */
  export let submitButtonText;

  let error = "";

  function handleSubmit() {
    // Trim whitespace.
    value = value.replace(/\s+/g, " ").trim();

    // Check if empty string.
    if (value === "") {
      error = "Cannot be blank!";
      return;
    }

    // Check if item already exists.
    for (const item of $store) {
      if (item.name.toLowerCase() === value.toLowerCase()) {
        error = `"${value}" already exists!`;
        return;
      }
    }

    addItemCallback();
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="join my-2 w-full">
  <input
    type="text"
    {placeholder}
    class="input input-bordered border-neutral w-full join-item"
    required
    bind:value
    on:input={() => (error = "")}
  />

  <button class="btn btn-accent join-item border border-neutral">
    {submitButtonText}
  </button>
</form>

{#if error}
  <p class="text-error" in:fly={{ y: -10 }}>{error}</p>
{/if}
