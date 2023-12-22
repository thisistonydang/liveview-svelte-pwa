defmodule LiveViewSvelteOfflineDemoWeb.Presence do
  @moduledoc """
  Provides presence tracking to channels and processes.

  See the [`Phoenix.Presence`](https://hexdocs.pm/phoenix/Phoenix.Presence.html)
  docs for more details.
  """
  use Phoenix.Presence,
    otp_app: :live_view_svelte_offline_demo,
    pubsub_server: LiveViewSvelteOfflineDemo.PubSub
end
