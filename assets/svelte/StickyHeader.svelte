<script>
  import Back from "./Back.svelte";

  /** @type {number} */
  let scrollY;
</script>

<svelte:window bind:scrollY />

<div
  class="sticky top-0 left-0 w-full py-1 z-10 bg-base-100 border-neutral h-16"
  class:border-b={scrollY > 0}
>
  <div class="max-w-2xl mx-auto px-2 md:p-0 h-full flex items-center">
    <Back showTopBarOnNav={false} />
  </div>
</div>
