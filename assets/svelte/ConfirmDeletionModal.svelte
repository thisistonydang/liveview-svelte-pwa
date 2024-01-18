<script lang="ts">
  import { onMount } from "svelte";

  import { clickOutside } from "lib/actions/clickOutside";

  import { openedMenuId } from "../stores/clientOnlyState";
  import { todoLists } from "../stores/crdtState";

  export let listId: string;
  export let menuClass: string;
  export let deleteItem;

  let dialog: HTMLDialogElement;

  onMount(() => {
    dialog.showModal();

    return () => dialog.close();
  });
</script>

<dialog
  bind:this={dialog}
  class="{menuClass} menu bg-base-200 border border-neutral rounded-box"
  on:close={() => ($openedMenuId = "")}
>
  <div class="text-lg" use:clickOutside={() => dialog.close()}>
    <p class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-2">Confirm Deletion</p>

    <div class="flex justify-around">
      <button class="btn border border-neutral" on:click={() => dialog.close()}>Cancel</button>

      <button
        class="btn btn-error border border-neutral"
        on:click={() => {
          deleteItem(todoLists, listId);
          dialog.close();
        }}
      >
        Delete
      </button>
    </div>
  </div>
</dialog>
