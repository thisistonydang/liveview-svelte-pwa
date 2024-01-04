<script>
  import { crossfade, fade, fly, scale } from "svelte/transition";
  import { SOURCES, TRIGGERS } from "svelte-dnd-action";

  import XMarkSvgIcon from "lib/svg-icons/XMarkSvgIcon.svelte";

  import { isCompletedOpened, isTodoOpened, newTodo } from "../stores/clientOnlyState";
  import { completedItems, todoItems } from "../stores/crdtState";
  import { liveView } from "../stores/liveViewSocket";

  import { syncClientToServer } from "./StateManagement.svelte";
  const [send, receive] = crossfade({ fallback: scale });
  let error = "";

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

  function deleteItem(item) {
    $completedItems = $completedItems.filter((i) => i.id !== item.id);
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

<div class="collapse collapse-arrow border border-neutral my-2">
  <input id="todo" type="checkbox" bind:checked={$isTodoOpened} />
  <label for="todo" class="collapse-title text-xl font-medium">
    To Do ({$todoItems.length})
  </label>
  <div class="collapse-content">
    {#if $todoItems.length}
      <ul>
        {#each $todoItems as item (item.id)}
          <li
            class="flex px-2 py-1.5 text-lg hover:bg-base-200 rounded-lg"
            animate:flip
            in:receive
            out:send
          >
            <label class="flex items-center gap-3 cursor-pointer">
              <input class="checkbox" type="checkbox" on:change={() => checkItem(item)} />
              <span>{item.name}</span>
            </label>
          </li>
        {/each}
      </ul>
    {:else}
      <p in:fade={{ delay: 250 }}>All done!</p>
    {/if}
  </div>
</div>

<div class="collapse collapse-arrow border border-neutral my-2">
  <input id="completed" type="checkbox" bind:checked={$isCompletedOpened} />
  <label for="completed" class="collapse-title text-xl font-medium">
    Completed ({$completedItems.length})
  </label>
  <div class="collapse-content">
    {#if $completedItems.length}
      <ul>
        {#each $completedItems as item (item.id)}
          <li
            class="flex items-center justify-between px-2 py-1.5 text-lg hover:bg-base-200 rounded-lg"
            animate:flip
            in:receive
            out:send
          >
            <label class="flex items-center gap-3 cursor-pointer">
              <input class="checkbox" type="checkbox" checked on:change={() => uncheckItem(item)} />
              <span class="line-through">{item.name}</span>
            </label>
            <button aria-label="Delete item." on:click={() => deleteItem(item)}>
              <XMarkSvgIcon className="w-6 h-6" />
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p in:fade={{ delay: 250 }}>No completed items.</p>
    {/if}
  </div>
</div>
