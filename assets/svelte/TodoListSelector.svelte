<script>
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { dndzone } from "svelte-dnd-action";

  import { clickOutside } from "lib/actions/clickOutside";
  import Bars3SvgIcon from "lib/svg-icons/Bars3SvgIcon.svelte";
  import ChevronRightSvgIcon from "lib/svg-icons/ChevronRightSvgIcon.svelte";

  import { activeTab, openedMenuId, selectedListId } from "../stores/clientOnlyState";
  import { todoLists, todoItems } from "../stores/crdtState";
  import EditForm from "./EditForm.svelte";
  import OptionsMenu from "./OptionsMenu.svelte";

  export let updateItem;
  export let deleteItem;
  export let handleConsider;
  export let handleFinalize;
  export let dragDisabled;
  export let handleStartDrag;
  export let handleDragKeyDown;
  export let flipDurationMs;
  export let menuClass;
</script>

<div
  class="min-h-[40px]"
  aria-label="Lists"
  use:dndzone={{
    items: $todoLists,
    flipDurationMs,
    dragDisabled,
    morphDisabled: true,
    dropTargetStyle: {},
    dropTargetClasses: ["border-2", "border-dashed", "rounded-lg", "border-accent"],
  }}
  on:consider={(event) => handleConsider(event, todoLists)}
  on:finalize={(event) => handleFinalize(event, todoLists)}
>
  {#each $todoLists as list (list.id)}
    {@const listItems = $todoItems.filter((item) => item.list_id === list.id)}
    {@const completedItems = listItems.filter((item) => item.completed)}
    <div
      class="flex items-center justify-between"
      aria-label={list.name}
      animate:flip={{ duration: flipDurationMs }}
    >
      {#if list.isEditing}
        <EditForm item={list} itemsStore={todoLists} {updateItem} />
      {:else}
        <button
          class="
            flex items-center gap-1 grow px-2 py-1.5 mr-5 rounded-lg
            text-lg text-left hover:bg-neutral
          "
          class:pointer-events-none={$openedMenuId}
          on:click={() => {
            $selectedListId = list.id;
            $activeTab = "To-Do";
            history.pushState({}, "", `/app#${list.id}`);
          }}
        >
          <span style="word-break: break-word;">
            {list.name}
            <span class="badge badge-xs transition-none p-2">
              {completedItems.length} / {listItems.length}
            </span>
          </span>
          <ChevronRightSvgIcon className="shrink-0 w-4 h-4" />
        </button>

        <div class="flex gap-1">
          <OptionsMenu item={list} itemsStore={todoLists} {updateItem} {deleteItem} {menuClass} />

          <!-- Drag Handle. -->
          <button
            aria-label="drag-handle"
            class:cursor-grab={dragDisabled}
            class:cursor-grabbing={!dragDisabled}
            on:mousedown={handleStartDrag}
            on:touchstart={handleStartDrag}
            on:keydown={handleDragKeyDown}
            use:clickOutside={() => (dragDisabled = true)}
          >
            <Bars3SvgIcon className="w-6 h-6" />
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <p class="flex items-center h-10 px-2" in:fade={{ delay: 250 }}>
      No lists yet. Please create a list to get started.
    </p>
  {/each}
</div>
