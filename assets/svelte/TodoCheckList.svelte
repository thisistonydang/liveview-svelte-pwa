<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { dndzone } from "svelte-dnd-action";
  import * as Y from "yjs";

  import { onKeydown } from "lib/actions/onKeydown";
  import { useHasTouchScreen } from "lib/hooks/useHasTouchScreen";

  import { todoItems, yTodoItems } from "../stores/crdtState";
  import { itemToProcessId, openedMenuId } from "../stores/clientOnlyState";
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
  export let handleDragKeyDown: (event: KeyboardEvent, itemId: string) => void;
  export let dragDisabled: boolean;
  export let flipDurationMs: number;
  export let menuClass: string;
  export let moveTodoMenuId: string;

  const hasTouchScreen = useHasTouchScreen();

  function updateUiOnConsider(newItems) {
    items = newItems;
  }

  function updateUiOnFinalize(newItems) {
    const oldIndex = $yTodoItems.toArray().findIndex((yMap) => yMap.get("id") === $itemToProcessId);

    const oldItem = $yTodoItems.get(oldIndex);
    const newItem = new Y.Map();
    newItem.set("id", oldItem.get("id"));
    newItem.set("name", oldItem.get("name"));
    newItem.set("completed", oldItem.get("completed"));
    newItem.set("list_id", oldItem.get("list_id"));

    $yTodoItems.doc.transact(() => {
      $yTodoItems.delete(oldIndex);

      // Move the item to the new position.

      const indexInNewItems = newItems.findIndex((list) => list.id === $itemToProcessId);
      const prevItemId = indexInNewItems === 0 ? null : newItems[indexInNewItems - 1].id;

      if (!prevItemId) {
        $yTodoItems.unshift([newItem]);
        return;
      }

      const index = $yTodoItems.toArray().findIndex((yMap) => yMap.get("id") === prevItemId) + 1;
      $yTodoItems.insert(index, [newItem]);
    });
  }
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
  on:consider={(event) => handleConsider(event, updateUiOnConsider)}
  on:finalize={(event) => handleFinalize(event, updateUiOnFinalize)}
>
  {#each items as item (item.id)}
    <li
      class="
        flex items-center justify-between rounded-lg
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      aria-label={item.name}
      animate:flip={{ duration: flipDurationMs }}
      use:onKeydown={(event) => handleDragKeyDown(event, item.id)}
    >
      {#if item.isEditing}
        <EditForm {item} itemsStore={todoItems} yItemsStore={yTodoItems} {updateItem} {menuClass} />
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
            yItemsStore={yTodoItems}
            {updateItem}
            {deleteItem}
            {menuClass}
            {moveTodoMenuId}
          />

          <DragHandle bind:dragDisabled itemId={item.id} />
        </div>
      {/if}
    </li>
  {:else}
    <li
      class="
      flex items-center h-10 px-2 rounded-lg
      focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
    "
      in:fade={{ delay: 250 }}
    >
      This list is looking lonely! Add some items?
    </li>
  {/each}
</ul>
