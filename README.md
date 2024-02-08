# Local-First LiveView Svelte ToDo App

This to-do app is a demo of an installable [Phoenix](https://www.phoenixframework.org/) 
Progressive Web App ([PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)) 
that can sync real-time across multiple devices while also being able to work locally offline.

## Technologies used

- Phoenix [LiveView](https://github.com/phoenixframework/phoenix_live_view),
  [PubSub](https://hexdocs.pm/phoenix/channels.html#pubsub), and
  [Ecto](https://github.com/elixir-ecto/ecto/tree/v3.11.1)/[PostgreSQL](https://www.postgresql.org/)
  for real-time syncing and data persistence.
- [Svelte](https://svelte.dev/) (via [live_svelte](https://github.com/woutdp/live_svelte))
  for the frontend UI and state management.
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), 
  [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), and
  [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 
  (via [y-indexeddb](https://github.com/yjs/y-indexeddb)) for offline support.
- [CRDTs](https://crdt.tech/) (via [Yjs](https://github.com/yjs/yjs)) to resolve conflicts between 
  distributed app states.

## Demo

A live demo can be found [here](https://liveview-svelte-pwa.fly.dev/app).

## Inspired by

- Wout De Puysseleir - [LiveSvelte - Render Svelte directly into Phoenix LiveView with E2E reactivity.](https://www.youtube.com/watch?v=JMkvbW35QvA)
- Ryan Cooke - [Ryan Cooke - E2E Reactivity - using Svelte with Phoenix LiveView](https://www.youtube.com/watch?v=asm2TTm035o)
- Daniils Petrovs - [SvelteKit: From landing page to offline PWAs](https://speakerdeck.com/danirukun/svelte-hololive-fan-booth-project)

## Contact

Created by [Tony Dang](https://tonydang.blog). Please feel free send any questions or feedback to
[tony@tonydang.blog](mailto:tony@tonydang.blog).
