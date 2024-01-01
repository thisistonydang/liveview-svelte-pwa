<script>
  export let showAuthLinks = false;
</script>

<div class="max-w-md mx-auto px-6 md:p-0 mt-10">
  <h1 class="text-5xl font-black my-5">Offline-Enabled LiveView Svelte Demo</h1>

  <p>
    This is a demo of a Phoenix LiveView
    <abbr class="underline-offset-4" title="Progressive WebApp">PWA</abbr>
    that can sync realtime across multiple devices while also being able to fallback to working offline.
  </p>

  <div class="my-6">
    <h2 class="text-3xl font-bold my-3">It utilizes the following technologies</h2>

    <ul class="list-disc pl-4">
      <li>Phoenix LiveView, Presence, and PubSub</li>
      <li>Ecto/PostgreSQL</li>
      <li>Svelte (via live_svelte)</li>
      <li>Service Workers</li>
      <li>LocalStorage</li>
    </ul>
  </div>

  {#if showAuthLinks}
    <h2 class="text-3xl font-bold my-3">Register or log in to try it out</h2>

    <ul class="flex gap-2">
      <li>
        <a href={"/users/register"} class="btn btn-accent border border-neutral">Register</a>
      </li>
      <li>
        <a href={"/users/log_in"} class="btn btn-accent border border-neutral">Log in</a>
      </li>
    </ul>
  {/if}
</div>
