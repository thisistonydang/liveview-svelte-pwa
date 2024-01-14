<script>
  import ArrowRightStartOnRectangleSvgIcon from "lib/svg-icons/ArrowRightStartOnRectangleSvgIcon.svelte";
  import EllipsisHorizontalCircleSvgIcon from "lib/svg-icons/EllipsisHorizontalCircleSvgIcon.svelte";
  import PencilSvgIcon from "lib/svg-icons/PencilSvgIcon.svelte";
  import TrashSvgIcon from "lib/svg-icons/TrashSvgIcon.svelte";

  import { moveTodoId, openedMenuId } from "../stores/clientOnlyState";

  export let item;
  export let itemsStore;
  export let updateItem;
  export let deleteItem;
  export let menuClass;
  export let moveTodoMenuId = undefined;
</script>

<div class="{menuClass} relative pointer-events-auto">
  <button
    class="flex items-center"
    aria-label="Toggle options menu."
    on:click={() => ($openedMenuId = $openedMenuId === item.id ? "" : item.id)}
  >
    <EllipsisHorizontalCircleSvgIcon className="w-6 h-6" />
  </button>

  {#if $openedMenuId === item.id}
    <div class="absolute right-8 -bottom-1 menu bg-base-200 border border-neutral rounded-box">
      <button
        class="flex items-center gap-1 p-2 rounded-lg hover:bg-neutral"
        on:click={() => deleteItem(itemsStore, item)}
      >
        <TrashSvgIcon className="w-4 h-4" />
        Delete
      </button>

      {#if moveTodoMenuId}
        <button
          class="flex items-center gap-1 p-2 rounded-lg hover:bg-neutral"
          on:click={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up to ClickOutsideClassHandler.
            $moveTodoId = item.id;
            $openedMenuId = moveTodoMenuId;
          }}
        >
          <ArrowRightStartOnRectangleSvgIcon className="w-4 h-4" />
          Move
        </button>
      {/if}

      <button
        class="flex items-center gap-1 p-2 rounded-lg hover:bg-neutral"
        on:click={() =>
          updateItem(itemsStore, {
            ...item,
            newName: item.name,
            isEditing: true,
          })}
      >
        <PencilSvgIcon className="w-4 h-4" />
        Edit
      </button>
    </div>
  {/if}
</div>
