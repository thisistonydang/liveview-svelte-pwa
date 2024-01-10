<script>
  import { fly } from "svelte/transition";

  /** @type {() => void}*/
  export let submitHandler;

  /** @type {string} */
  export let value;

  /** @type {string} */
  export let placeholder;

  /** @type {string} */
  export let submitButtonText;

  /** @type {string} */
  export let error;
</script>

<form on:submit|preventDefault={submitHandler} class="join my-2 w-full">
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
