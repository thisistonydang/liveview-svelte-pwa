defmodule LiveViewSvelteOfflineDemoWeb.AppHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  alias LiveViewSvelteOfflineDemo.UserStates

  def index(assigns) do
    ~H"""
    <!-- LiveView Socket -->
    <%= live_render(@conn, LiveViewSvelteOfflineDemoWeb.SocketLive) %>
    <!-- Svelte App -->
    <.App currentUserEmail={@current_user.email} server_state={UserStates.initial_server_state()} />
    """
  end
end
