<script>
  import GitHubSvgIcon from "lib/svg-icons/GitHubSvgIcon.svelte";
  import Link from "./Link.svelte";

  export let showAuthLinks = false;
</script>

<div class="max-w-md mx-auto px-6 md:p-0 mt-10">
  <h1 class="text-5xl font-black my-5">Offline-Enabled LiveView Svelte Demo</h1>

  <p>
    This is a demo of an installable
    <Link href="https://www.phoenixframework.org/" external>Phoenix</Link>
    PWA (<Link href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" external>
      Progressive Web App</Link
    >) that can sync real-time across multiple devices while also being able to fallback to working
    offline.
  </p>

  <div class="my-6">
    <h2 class="text-3xl font-bold my-3">It utilizes the following technologies</h2>

    <ul class="list-disc pl-4">
      <li>
        Phoenix
        <Link href="https://github.com/phoenixframework/phoenix_live_view" external>LiveView</Link>,
        <Link href="https://hexdocs.pm/phoenix/channels.html#pubsub" external>PubSub</Link>, and
        <Link href="https://github.com/elixir-ecto/ecto/tree/v3.11.1" external>Ecto</Link>/<Link
          href="https://www.postgresql.org/"
          external
        >
          PostgreSQL
        </Link> for real-time syncing and data persistence.
      </li>

      <li>
        <Link href="https://svelte.dev/" external>Svelte</Link>
        (via <Link href="https://github.com/woutdp/live_svelte" external>live_svelte</Link>),
        <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" external
          >Service Workers</Link
        >, and
        <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" external>
          localStorage
        </Link> for offline support.
      </li>

      <li>
        <Link href="https://crdt.tech/" external>CRDTs</Link>
        to resolve conflicts between distributed app states.
      </li>
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

  <div class="my-6">
    <h2 class="text-3xl font-bold my-3">Inspired by</h2>

    <ul class="list-disc pl-4">
      <li>
        Wout De Puysseleir -
        <Link href="https://www.youtube.com/watch?v=JMkvbW35QvA" external>
          LiveSvelte - Render Svelte directly into Phoenix LiveView with E2E reactivity.
        </Link>
      </li>

      <li>
        Ryan Cooke -
        <Link href="https://www.youtube.com/watch?v=asm2TTm035o" external>
          E2E Reactivity - using Svelte with Phoenix LiveView
        </Link>
      </li>

      <li>
        Daniils Petrovs -
        <Link href="https://speakerdeck.com/danirukun/svelte-hololive-fan-booth-project" external>
          SvelteKit: From landing page to offline PWAs
        </Link>
      </li>
    </ul>
  </div>

  <div class="my-6">
    <h2 class="text-3xl font-bold my-3">Contact</h2>

    Created by
    <Link href="https://tonydang.blog" external>Tony Dang</Link>. Please feel free send any
    questions or feedback to
    <Link href="mailto:tony@tonydang.blog" external>tony@tonydang.blog</Link>.
  </div>

  <div class="my-6">
    <h2 class="text-3xl font-bold my-3">Source Code</h2>
    <a
      href="https://github.com/tonydangblog/liveview-svelte-pwa"
      aria-label="Github"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block hover:opacity-75"
    >
      <GitHubSvgIcon className="h-10 w-10" />
    </a>
  </div>
</div>
