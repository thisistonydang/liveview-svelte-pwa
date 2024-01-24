<script lang="ts">
  import { onMount } from "svelte";

  import { focusTrap } from "@skeletonlabs/skeleton";

  import { clickOutside } from "lib/actions/clickOutside";
  import XMarkSvgIcon from "lib/svg-icons/XMarkSvgIcon.svelte";

  import { itemToProcessId, openedMenuId, selectedListId } from "../stores/clientOnlyState";
  import { todoLists } from "../stores/crdtState";
  import { toast } from "../stores/toast";

  export let itemToMove;
  export let menuClass: string;
  export let moveTodo;

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
  <div class="text-lg" use:clickOutside={() => dialog.close()} use:focusTrap={true}>
    <p class="pl-4 pr-14 py-2 font-bold border-b border-neutral rounded-none mb-1.5">Select List</p>

    <button class="absolute top-3.5 right-3" aria-label="Close." on:click={() => dialog.close()}>
      <XMarkSvgIcon className="w-5 h-5" />
    </button>

    <ul>
      {#each $todoLists as list (list.id)}
        <li>
          <label
            style="word-break: break-word;"
            class="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer"
          >
            <input
              type="radio"
              class="radio bg-transparent focus:radio-accent pointer-events-auto"
              class:radio-accent={$selectedListId === list.id}
              class:hover:radio-accent={$selectedListId === list.id}
              name="list-to-move-to"
              checked={list.id === itemToMove.list_id}
              on:click={(e) => {
                e.stopPropagation(); // Prevent clicks from closing toast message.
                e.preventDefault(); // Prevent radio button from being checked.

                // Try to move the todo item to the selected list.
                const response = moveTodo(itemToMove, list.id);
                if (response === "error") {
                  $toast = {
                    show: true,
                    kind: "info",
                    title: "Whoops, can't move item...",
                    msg: `'${itemToMove.name}' already exists in the '${list.name}' list.`,
                  };
                } else {
                  dialog.close();
                  $toast = {
                    show: false,
                    kind: "info",
                    title: "",
                    msg: "",
                  };
                }
              }}
            />

            {list.name}
          </label>
        </li>
      {/each}
    </ul>
  </div>
</dialog>
