# Offline-Enabled LiveView Svelte Demo

This is a demo of an installable [Phoenix](https://www.phoenixframework.org/) PWA 
([Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)) that
can sync real-time across multiple devices while also being able to fallback to working offline.

## It utilizes the following technologies

- Phoenix [LiveView](https://github.com/phoenixframework/phoenix_live_view),
  [PubSub](https://hexdocs.pm/phoenix/channels.html#pubsub), and
  [Ecto](https://github.com/elixir-ecto/ecto/tree/v3.11.1)/[PostgreSQL](https://www.postgresql.org/)
  for real-time syncing and data persistence.
- [Svelte](https://svelte.dev/) (via [live_svelte](https://github.com/woutdp/live_svelte)),
  [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), 
  and [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 
  for offline support.

## Demo

A live demo can be found [here](https://liveview-svelte-pwa.fly.dev/app).

## Inspired by

- [Ryan Cooke - E2E Reactivity - using Svelte with Phoenix LiveView](https://www.youtube.com/watch?v=asm2TTm035o)
- [LiveSvelte - Render Svelte directly into Phoenix LiveView with E2E reactivity.](https://www.youtube.com/watch?v=JMkvbW35QvA)

## Contact

Created by [Tony Dang](https://tonydang.blog). Please feel free send any questions or feedback to
[tony@tonydang.blog](mailto:tony@tonydang.blog).
