<script>
  import ChevronDownSvgIcon from "lib/svg-icons/ChevronDownSvgIcon.svelte";
  import ChevronUpSvgIcon from "lib/svg-icons/ChevronUpSvgIcon.svelte";

  /** @type {string} */
  export let title;

  /** @type {number} */
  export let totalCount;

  /** @type {number | undefined} */
  export let completedCount = undefined;

  /** @type {boolean} */
  export let isDropdownOpened;
</script>

<div class="collapse border border-neutral mt-2 mb-20 overflow-visible">
  <!-- This hidden checkbox controls the collapse via Daisy UI. -->
  <input type="checkbox" class="pointer-events-none" bind:checked={isDropdownOpened} />

  <!-- Collapse title. -->
  <div class="collapse-title relative" style="cursor: default;">
    <div class="flex gap-2 items-center text-xl font-medium mr-5">
      <span style="word-break: break-word;">{title}</span>

      <span class="badge badge-neutral shrink-0">
        {completedCount !== undefined ? `${completedCount} / ${totalCount}` : totalCount}
      </span>
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
    <slot />
  </div>
</div>
