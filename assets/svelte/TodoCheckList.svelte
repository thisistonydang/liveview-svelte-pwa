<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { dndzone } from "svelte-dnd-action";

  import { onKeydown } from "lib/actions/onKeydown";
  import { useHasTouchScreen } from "lib/hooks/useHasTouchScreen";

  import { todoItems } from "../stores/crdtState";
  import { openedMenuId } from "../stores/clientOnlyState";
  import DragHandle from "./DragHandle.svelte";
  import EditForm from "./EditForm.svelte";
  import OptionsMenu from "./OptionsMenu.svelte";

  export let title: string;
  export let items;
  export let toggleCompleted;
  export let updateItem;
  export let deleteItem;
  export let handleConsider;
  export let handleFinalize;
  export let handleDragKeyDown: (event: KeyboardEvent) => void;
  export let dragDisabled: boolean;
  export let flipDurationMs: number;
  export let menuClass: string;
  export let moveTodoMenuId: string;

  const hasTouchScreen = useHasTouchScreen();
</script>

<ul
  class="
    min-h-[40px] rounded-lg
    focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
  "
  aria-label={title}
  use:dndzone={{
    items,
    flipDurationMs,
    dragDisabled,
    morphDisabled: true,
    dropTargetStyle: {},
    dropTargetClasses: ["border-2", "border-dashed", "rounded-lg", "border-accent"],
  }}
  on:consider={(event) => handleConsider(event, todoItems)}
  on:finalize={(event) => handleFinalize(event, todoItems)}
>
  {#each items as item (item.id)}
    <li
      class="
        flex items-center justify-between rounded-lg
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      aria-label={item.name}
      animate:flip={{ duration: flipDurationMs }}
      use:onKeydown={handleDragKeyDown}
    >
      {#if item.isEditing}
        <EditForm {item} itemsStore={todoItems} {updateItem} {menuClass} />
      {:else}
        <label
          title="Click to toggle completed."
          class="
            flex items-center gap-3 grow px-2 py-1.5 mr-5 rounded-lg
            text-lg cursor-pointer active:bg-base-300"
          class:opacity-50={item.completed}
          class:pointer-events-none={$openedMenuId}
          class:hover:bg-base-200={!hasTouchScreen}
        >
          <input
            type="checkbox"
            class="
              checkbox bg-transparent pointer-events-auto
              focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-transparent
            "
            checked={item.completed}
            on:change={() => toggleCompleted(item.id)}
            on:keydown={(event) => {
              if (event.key === "Enter") {
                toggleCompleted(item.id);
              }
            }}
          />

          <span style="word-break: break-word;" class:line-through={item.completed}>
            {item.name}
          </span>
        </label>

        <div class="flex gap-1">
          <OptionsMenu
            {item}
            itemsStore={todoItems}
            {updateItem}
            {deleteItem}
            {menuClass}
            {moveTodoMenuId}
          />

          <DragHandle bind:dragDisabled />
        </div>
      {/if}
    </li>
  {:else}
    <li class="flex items-center h-10 px-2" in:fade={{ delay: 250 }}>
      This list is looking lonely! Add some items?
    </li>
  {/each}
</ul>
