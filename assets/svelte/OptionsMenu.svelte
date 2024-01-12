<script>
  import EllipsisHorizontalCircleSvgIcon from "lib/svg-icons/EllipsisHorizontalCircleSvgIcon.svelte";
  import PencilSvgIcon from "lib/svg-icons/PencilSvgIcon.svelte";
  import TrashSvgIcon from "lib/svg-icons/TrashSvgIcon.svelte";

  import { openedMenuId } from "../stores/clientOnlyState";

  export let item;
  export let itemsStore;
  export let updateItem;
  export let deleteItem;
  export let menuClass;
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
    <div class="absolute right-8 -top-3 menu bg-base-200 border border-neutral rounded-box">
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1 p-2 rounded-lg hover:bg-neutral"
          on:click={() => deleteItem(itemsStore, item)}
        >
          <TrashSvgIcon className="w-4 h-4" />
          Delete
        </button>

        <div class="bg-neutral-content opacity-75 h-6 w-[1px]" />

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
    </div>
  {/if}
</div>
