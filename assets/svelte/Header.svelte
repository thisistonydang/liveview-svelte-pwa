<script lang="ts">
  import AccountButton from "./AccountButton.svelte";
  import SessionsBadge from "./SessionsBadge.svelte";
  import ShareButton from "./ShareButton.svelte";
  import SyncStatusBadge from "./SyncStatusBadge.svelte";
  import ThemeButton from "./ThemeButton.svelte";

  export let currentUserEmail: string;
  export let serviceWorkerVersion: string;
  export let isClientStateRestored: boolean;
  export let menuClass: string;

  let scrollY: number;
</script>

<svelte:window bind:scrollY />

<div
  class="sticky top-0 left-0 w-full pt-2 pb-1 z-10 bg-base-100 border-neutral"
  class:border-b={scrollY > 0}
>
  <div class="max-w-2xl mx-auto px-2 md:p-0 flex justify-between items-center gap-3">
    <div>
      <SyncStatusBadge />
      <SessionsBadge />
    </div>

    <div class="flex items-center gap-3">
      <ShareButton />
      <ThemeButton {menuClass} />
      <AccountButton
        {currentUserEmail}
        {serviceWorkerVersion}
        bind:isClientStateRestored
        {menuClass}
      />
    </div>
  </div>
</div>
