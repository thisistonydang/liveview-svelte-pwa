<script lang="ts">
  import { sineIn } from "svelte/easing";
  import { fade } from "svelte/transition";

  import ChevronDownSvgIcon from "lib/svg-icons/ChevronDownSvgIcon.svelte";
  import ChevronUpSvgIcon from "lib/svg-icons/ChevronUpSvgIcon.svelte";

  export let title: string;
  export let totalCount: number;
  export let completedCount: number | undefined = undefined;
  export let isDropdownOpened: boolean;

  const emoticons = [
    "(◕‿◕)",
    "(＾▽＾)",
    "◉‿◉",
    "≖‿≖",
    "മ◡മ",
    "╰(▔∀▔)╯",
    "⊙▽⊙",
    "ȏ.̮ȏ",
    "◙‿◙",
    "(^人^)",
    "٩(◕‿◕｡)۶",
    "മ◡മ",
    "(*^‿^*)",
    "( ‾́ ◡ ‾́ )",
    "(￣个￣)",
    "(*꒦ິ꒳꒦ີ)",
    "(¬‿¬)",
    "(•‿•)",
  ];
  let emoticonIndex = 0;

  $: if (isDropdownOpened) {
    emoticonIndex++;
    if (emoticonIndex >= emoticons.length) {
      emoticonIndex = 0;
    }
  }
</script>

<div class="collapse border border-neutral mt-2 mb-10 overflow-visible">
  <!-- This hidden checkbox controls the collapse via Daisy UI. -->
  <input type="checkbox" class="hidden pointer-events-none" bind:checked={isDropdownOpened} />

  <!-- Collapse title. -->
  <div class="collapse-title relative" style="cursor: default;">
    <div class="flex gap-2 items-center text-xl font-medium mr-5">
      <span style="word-break: break-word;">{title}</span>

      <span class="badge badge-neutral shrink-0">
        {completedCount !== undefined ? `${completedCount} / ${totalCount}` : totalCount}
      </span>
    </div>

    <!-- Collapse toggle. -->
    <button
      class="swap swap-rotate absolute top-[18px] right-5"
      class:swap-active={isDropdownOpened}
      on:click={() => (isDropdownOpened = !isDropdownOpened)}
    >
      <ChevronDownSvgIcon className="swap-off w-6 h-6" />
      <ChevronUpSvgIcon className="swap-on w-6 h-6" />
    </button>
  </div>

  <div class="collapse-content">
    <slot />
  </div>
</div>

{#if !isDropdownOpened}
  <div class="text-center text-6xl xs:text-7xl sm:text-8xl opacity-90" in:fade={{ easing: sineIn }}>
    {emoticons[emoticonIndex]}
  </div>
{/if}
