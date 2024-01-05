<script>
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { dndzone } from "svelte-dnd-action";

  import { clickOutside } from "lib/hooks/clickOutside";
  import Bars3SvgIcon from "lib/svg-icons/Bars3SvgIcon.svelte";
  import ChevronDownSvgIcon from "lib/svg-icons/ChevronDownSvgIcon.svelte";
  import ChevronUpSvgIcon from "lib/svg-icons/ChevronUpSvgIcon.svelte";
  import { isThemeMenuOpened } from "lib/theme-selector";

  import { isAccountMenuOpened } from "../stores/clientOnlyState";
  import TodoEditForm from "./TodoEditForm.svelte";
  import TodoOptionsMenu from "./TodoOptionsMenu.svelte";

  export let title;
  export let isDropdownOpened;
  export let items;
  export let itemsStore;
  export let checkHandler;
  export let updateItem;
  export let deleteItem;
  export let handleConsider;
  export let handleFinalize;
  export let dragDisabled;
  export let noItemsMessage;

  const flipDurationMs = 100;

  function startDrag(event) {
    // Preventing default to prevent lag on touch devices (because of the
    // browser checking for screen scrolling).
    event.preventDefault();
    dragDisabled = false;
    $isThemeMenuOpened = false;
    $isAccountMenuOpened = false;
  }

  function handleKeyDown(e) {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled) {
      dragDisabled = false;
    }
  }
</script>

<div class="collapse border border-neutral my-2">
  <!-- This hidden checkbox controls the collapse via Daisy UI. -->
  <input type="checkbox" class="pointer-events-none" bind:checked={isDropdownOpened} />

  <!-- Collapse title. -->
  <div class="collapse-title relative" style="cursor: default;">
    <div class="flex gap-2 items-center text-xl font-medium">
      <span>{title}</span>
      <span class="badge badge-neutral">{items.length}</span>
    </div>

    <!-- Collapse toggle. -->
    <label class="cursor-pointer swap swap-rotate absolute top-[18px] right-5">
      <!-- This checkbox toggles the above Daisy UI checkbox. -->
      <input type="checkbox" class="hidden" bind:checked={isDropdownOpened} />
      <ChevronDownSvgIcon className="swap-off w-6 h-6" />
      <ChevronUpSvgIcon className="swap-on w-6 h-6" />
    </label>
  </div>

  <div class="collapse-content">
    <ul
      class="min-h-[40px]"
      aria-label={title}
      use:dndzone={{
        items,
        flipDurationMs,
        dragDisabled: !items.length || dragDisabled,
        morphDisabled: true,
        dropTargetStyle: {},
        dropTargetClasses: ["border-2", "border-dashed", "rounded-lg", "border-accent"],
      }}
      on:consider={(event) => handleConsider(event, itemsStore)}
      on:finalize={(event) => handleFinalize(event, itemsStore)}
    >
      {#each items as item (item.id)}
        <li
          class="flex items-center justify-between px-2 py-1.5 text-lg rounded-lg"
          aria-label={item.name}
          animate:flip={{ duration: flipDurationMs }}
        >
          {#if item.isEditing}
            <TodoEditForm {item} {itemsStore} {updateItem} />
          {:else}
          <span class="flex items-center gap-3">
            <input
              class="checkbox"
              type="checkbox"
              checked={title === "Completed"}
              on:change={() => checkHandler(item)}
            />

            <span class:line-through={title === "Completed"}>{item.name}</span>
          </span>

          <div class="flex gap-1">
            <TodoOptionsMenu {item} {deleteItem} />

            <!-- Drag Handle. -->
            <button
              aria-label="drag-handle"
              class:cursor-grab={dragDisabled}
              class:cursor-grabbing={!dragDisabled}
              on:mousedown={startDrag}
              on:touchstart={startDrag}
              on:keydown={handleKeyDown}
              use:clickOutside={() => (dragDisabled = true)}
            >
              <Bars3SvgIcon className="w-6 h-6" />
            </button>
          </div>
          {/if}
        </li>
      {:else}
        <p class="flex items-center h-10" in:fade={{ delay: 250 }}>{noItemsMessage}</p>
      {/each}
    </ul>
  </div>
</div>
