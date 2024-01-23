<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { dndzone } from "svelte-dnd-action";

  import { useHasTouchScreen } from "lib/hooks/useHasTouchScreen";
  import ChevronRightSvgIcon from "lib/svg-icons/ChevronRightSvgIcon.svelte";

  import { openedMenuId, selectedListId, urlHash } from "../stores/clientOnlyState";
  import { todoLists, todoItems } from "../stores/crdtState";
  import DragHandle from "./DragHandle.svelte";
  import EditForm from "./EditForm.svelte";
  import OptionsMenu from "./OptionsMenu.svelte";

  export let updateItem;
  export let deleteItem;
  export let handleConsider;
  export let handleFinalize;
  export let dragDisabled: boolean;
  export let flipDurationMs: number;
  export let menuClass: string;
  export let confirmDeletionModalId: string;

  const hasTouchScreen = useHasTouchScreen();
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
        <EditForm item={list} itemsStore={todoLists} {updateItem} {menuClass} />
      {:else}
        <button
          class="
            flex items-center gap-1 grow px-2 py-1.5 mr-5 rounded-lg
            text-lg text-left active:bg-base-300
          "
          class:pointer-events-none={$openedMenuId}
          class:hover:bg-base-200={!hasTouchScreen}
          on:click={() => {
            $urlHash = "listId";
            $selectedListId = list.id;
            history.pushState({}, "", `/app#${list.id}`);
            window.scrollTo(0, 0);
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
          <OptionsMenu
            item={list}
            itemsStore={todoLists}
            {updateItem}
            {deleteItem}
            {menuClass}
            {confirmDeletionModalId}
          />

          <DragHandle bind:dragDisabled />
        </div>
      {/if}
    </div>
  {:else}
    <p class="flex items-center h-10 px-2" in:fade={{ delay: 250 }}>
      No lists yet. Please create a list to get started.
    </p>
  {/each}
</div>
