<script>
  import ChevronDownSvgIcon from "lib/svg-icons/ChevronDownSvgIcon.svelte";
  import ChevronUpSvgIcon from "lib/svg-icons/ChevronUpSvgIcon.svelte";

  import TodoCheckList from "./TodoCheckList.svelte";

  export let title;
  export let isDropdownOpened;
  export let itemsStore;
  export let toggleCompleted;
  export let updateItem;
  export let deleteItem;
  export let handleConsider;
  export let handleFinalize;
  export let dragDisabled;
  export let handleStartDrag;
  export let handleDragKeyDown;
  export let flipDurationMs;
  export let noItemsMessage;
  export let optionsMenuClass;
</script>

<div class="collapse border border-neutral mt-2 mb-20">
  <!-- This hidden checkbox controls the collapse via Daisy UI. -->
  <input type="checkbox" class="pointer-events-none" bind:checked={isDropdownOpened} />

  <!-- Collapse title. -->
  <div class="collapse-title relative" style="cursor: default;">
    <div class="flex gap-2 items-center text-xl font-medium">
      <span>{title}</span>
      <span class="badge badge-neutral">{$itemsStore.length}</span>
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
    <TodoCheckList
      {title}
      {itemsStore}
      {toggleCompleted}
      {updateItem}
      {deleteItem}
      {handleConsider}
      {handleFinalize}
      {dragDisabled}
      {handleStartDrag}
      {handleDragKeyDown}
      {flipDurationMs}
      {noItemsMessage}
      {optionsMenuClass}
    />
  </div>
</div>
