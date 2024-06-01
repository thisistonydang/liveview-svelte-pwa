<script lang="ts">
  import { fly } from "svelte/transition";

  export let addItemCallback: () => void;
  export let value: string;
  export let placeholder: string;
  export let submitButtonText: string;
  export let submitButtonTitle: string;
  export let isScrollPositionRestored: boolean;

  let error = "";

  function handleSubmit() {
    // Trim whitespace.
    value = value.replace(/\s+/g, " ").trim();

    // Check if empty string.
    if (value === "") {
      error = "Cannot be blank!";
      return;
    }

    // Check if string is too long.
    if (value.length > 500) {
      error = "Cannot be over 500 characters!";
      return;
    }

    addItemCallback();
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="join my-1 w-full"
  style:visibility={isScrollPositionRestored ? "visible" : "hidden"}
>
  <input
    type="text"
    {placeholder}
    class="
      input input-bordered border-neutral w-full join-item
      focus:outline-none focus:ring-1 focus:ring-accent focus:ring-inset
    "
    required
    bind:value
    on:input={() => (error = "")}
  />

  <button class="btn btn-accent join-item border border-neutral" title={submitButtonTitle}>
    {submitButtonText}
  </button>
</form>

{#if error}
  <p style="word-break: break-word;" class="text-error" in:fly={{ y: -10 }}>{error}</p>
{/if}
