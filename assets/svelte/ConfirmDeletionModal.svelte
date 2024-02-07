<script lang="ts">
  import { onMount } from "svelte";

  import { focusTrap } from "$lib/actions/focusTrap";
  import { clickOutside } from "$lib/actions/clickOutside";

  import { itemToProcessId, openedMenuId } from "$stores/clientOnlyState";
  import { todoLists } from "$stores/crdtState";

  import type { DeleteItem } from "./TodoApp.svelte";

  export let listId: string;
  export let menuClass: string;
  export let deleteItem: DeleteItem;

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
    <p class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-2">Confirm Deletion</p>

    <div class="flex justify-around">
      <button
        data-focusindex="0"
        class="
        btn border border-neutral
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
        on:click={() => dialog.close()}
      >
        Cancel
      </button>

      <button
        data-focusindex="1"
        class="btn btn-error border border-neutral"
        on:click={() => {
          const list = $todoLists.find((list) => list.id === listId);
          deleteItem(list);
          dialog.close();
        }}
      >
        Delete
      </button>
    </div>
  </div>
</dialog>
