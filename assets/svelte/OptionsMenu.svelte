<script>
  import { scale } from "svelte/transition";

  import ArrowRightStartOnRectangleSvgIcon from "lib/svg-icons/ArrowRightStartOnRectangleSvgIcon.svelte";
  import EllipsisHorizontalCircleSvgIcon from "lib/svg-icons/EllipsisHorizontalCircleSvgIcon.svelte";
  import PencilSvgIcon from "lib/svg-icons/PencilSvgIcon.svelte";
  import TrashSvgIcon from "lib/svg-icons/TrashSvgIcon.svelte";
  import XCircleSvgIcon from "lib/svg-icons/XCircleSvgIcon.svelte";

  import { itemToProcessId, openedMenuId } from "../stores/clientOnlyState";

  export let item;
  export let itemsStore;
  export let updateItem;
  export let deleteItem;
  export let menuClass;
  export let moveTodoMenuId = undefined;
  export let confirmDeletionModalId = undefined;
</script>

<div class="{menuClass} relative pointer-events-auto">
  <button
    class="flex items-center"
    aria-label="Toggle options menu."
    on:click={() => ($openedMenuId = $openedMenuId === item.id ? "" : item.id)}
  >
    <div class="swap swap-rotate">
      <input type="checkbox" class="hidden" checked={$openedMenuId === item.id} />
      <EllipsisHorizontalCircleSvgIcon className="swap-off w-6 h-6" />
      <XCircleSvgIcon className="swap-on w-6 h-6" />
    </div>
  </button>

  {#if $openedMenuId === item.id}
    <div
      in:scale={{ duration: 100 }}
      class="absolute right-8 -bottom-1 menu bg-base-200 border border-neutral rounded-box"
    >
      <li>
        <button
          class="flex items-center gap-1 p-2 rounded-lg"
          on:click={(e) => {
            if (confirmDeletionModalId) {
              e.stopPropagation(); // Prevent event from bubbling up to ClickOutsideClassHandler.
              $itemToProcessId = item.id;
              $openedMenuId = confirmDeletionModalId;
            } else {
              deleteItem(itemsStore, item.id);
            }
          }}
        >
          <TrashSvgIcon className="w-4 h-4" />
          Delete
        </button>
      </li>

      {#if moveTodoMenuId}
        <li>
          <button
            class="flex items-center gap-1 p-2 rounded-lg"
            on:click={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up to ClickOutsideClassHandler.
              $itemToProcessId = item.id;
              $openedMenuId = moveTodoMenuId;
            }}
          >
            <ArrowRightStartOnRectangleSvgIcon className="w-4 h-4" />
            Move
          </button>
        </li>
      {/if}

      <li>
        <button
          class="flex items-center gap-1 p-2 rounded-lg"
          on:click={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to ClickOutsideClassHandler.
            $openedMenuId = "edit-form-id";

            updateItem(itemsStore, {
              ...item,
              newName: item.name,
              isEditing: true,
            });
          }}
        >
          <PencilSvgIcon className="w-4 h-4" />
          Edit
        </button>
      </li>
    </div>
  {/if}
</div>
