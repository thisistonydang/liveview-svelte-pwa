<script lang="ts">
  import { sineIn } from "svelte/easing";
  import { fade } from "svelte/transition";

  import { ChevronDown, ChevronUp } from "lucide-svelte";

  export let title: string;
  export let totalCount: number;
  export let uncompletedCount: number | undefined = undefined;
  export let isDropdownOpened: boolean;
  export let isScrollPositionRestored: boolean;

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

<div
  class="collapse border border-neutral mt-2 mb-20 overflow-visible"
  class:collapse-open={isDropdownOpened}
  style:visibility={isScrollPositionRestored ? "visible" : "hidden"}
>
  <!-- Collapse title. -->
  <div class="collapse-title relative" style="cursor: default;">
    <div class="flex gap-2 items-center text-xl font-medium mr-5">
      <span style="word-break: break-word;">{title}</span>

      <span
        title={uncompletedCount !== undefined
          ? `${uncompletedCount} Uncompleted / ${totalCount} Total`
          : `${totalCount} Lists`}
        class="badge badge-neutral shrink-0"
      >
        {uncompletedCount !== undefined ? `${uncompletedCount} / ${totalCount}` : totalCount}
      </span>
    </div>

    <!-- Collapse toggle. -->
    <button
      title="Toggle collapse."
      aria-label="Toggle collapse."
      class="
       swap swap-rotate absolute top-[18px] right-5 rounded-lg
       focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      class:swap-active={isDropdownOpened}
      on:click={() => (isDropdownOpened = !isDropdownOpened)}
    >
      <ChevronDown class="swap-off" />
      <ChevronUp class="swap-on" />
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
