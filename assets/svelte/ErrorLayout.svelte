<script lang="ts">
  import { showTopBar } from "$lib/topbar";

  import type { Live } from "live_svelte";

  export let live: Live = undefined;
  live;

  export let title: string;
  export let subtitle: string = undefined;
  export let href: string;
  export let linkText: string;
</script>

<div class="hero min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <div class="mx-auto text-8xl mb-10">(◑_◑)</div>
      <h1 class="text-xl font-bold my-3">{title}</h1>

      {#if subtitle}
        <p class="my-2">{subtitle}</p>
      {/if}

      <a
        class="btn btn-accent my-2"
        {href}
        on:click|preventDefault={() => {
          showTopBar();
          window.location.replace(href);
        }}
      >
        {linkText}
      </a>
    </div>
  </div>
</div>
