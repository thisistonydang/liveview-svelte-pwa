defmodule LiveViewSvelteOfflineDemoWeb.AppHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <!-- LiveView Socket -->
    <%= live_render(@conn, LiveViewSvelteOfflineDemoWeb.SocketLive) %>
    <!-- Svelte App -->
    <.App currentUserEmail={@current_user.email} />
    """
  end
end
