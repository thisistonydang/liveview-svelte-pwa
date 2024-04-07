<script lang="ts">
  import { onMount } from "svelte";
  import { X } from "lucide-svelte";

  import { focusTrap } from "$lib/actions/focusTrap";
  import { clickOutside } from "$lib/actions/clickOutside";

  import { itemToProcessId, openedMenuId } from "$stores/clientOnlyState";
  import { todoLists } from "$stores/crdtState";

  import type { TodoItem } from "$stores/crdtState";

  export let itemToMove: TodoItem;
  export let menuClass: string;
  export let moveTodo: (itemToMove: TodoItem, newListId: string) => void;

  let dialog: HTMLDialogElement;

  onMount(() => {
    dialog.showModal();

    return () => dialog.close();
  });
</script>

<dialog
  bind:this={dialog}
  class="{menuClass} menu bg-base-200 border border-neutral rounded-box"
  on:close={() => {
    $openedMenuId = "";
    $itemToProcessId = "";
  }}
>
  <div
    class="text-lg"
    use:clickOutside={() => dialog.close()}
    use:focusTrap={{
      focusFirstElement: true,
      onEscape: () => dialog.close(),
    }}
  >
    <p class="pl-4 pr-14 py-2 font-bold border-b border-neutral rounded-none mb-1.5">Select List</p>

    <button
      data-focusindex="0"
      class="
        absolute top-3.5 right-3 rounded-lg
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      aria-label="Close."
      title="Close."
      on:click={() => dialog.close()}
    >
      <X class="w-5 h-5" />
    </button>

    <ul>
      {#each $todoLists as list, index (list.id)}
        <li>
          <button
            data-focusindex={index + 1}
            title="Move to this list."
            class="
              flex items-center gap-3 rounded-lg
              focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
            "
            style="word-break: break-word;"
            on:click={() => {
              moveTodo(itemToMove, list.id);
              dialog.close();
            }}
          >
            <input
              aria-hidden="true"
              tabindex="-1"
              type="radio"
              class="radio bg-transparent"
              class:radio-accent={list.id === itemToMove.listId}
              checked={list.id === itemToMove.listId}
            />

            {list.name}
          </button>
        </li>
      {/each}
    </ul>
  </div>
</dialog>
