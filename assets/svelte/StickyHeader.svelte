<script lang="ts">
  import Back from "./Back.svelte";

  let scrollY: number;
</script>

<svelte:window bind:scrollY />

<div
  class="sticky top-0 left-0 w-full z-10 backdrop-blur border-neutral h-[68px]"
  class:border-b={scrollY > 0}
>
  <div class="max-w-2xl mx-auto px-2 md:p-0 h-full flex items-center">
    <Back />
  </div>
</div>
