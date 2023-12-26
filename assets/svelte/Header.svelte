<script>
  import AccountButton from "./AccountButton.svelte";
  import SessionsBadge from "./SessionsBadge.svelte";
  import SyncStatusBadge from "./SyncStatusBadge.svelte";

  export let currentUserEmail;

  let scrollY;
</script>

<svelte:window bind:scrollY />

<div
  class="sticky top-0 left-0 w-full py-1 z-10 bg-base-100 border-neutral"
  class:border-b={scrollY > 0}
>
  <div class="max-w-2xl mx-auto px-2 md:p-0 flex justify-between items-center">
    <div>
      <SyncStatusBadge />
      <SessionsBadge />
    </div>

    <AccountButton {currentUserEmail} />
  </div>
</div>
