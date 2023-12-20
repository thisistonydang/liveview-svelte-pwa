defmodule LiveViewSvelteOfflineDemoWeb.FallbackHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  alias LiveViewSvelteOfflineDemo.UserStates

  def index(assigns) do
    ~H"""
    <.App
      currentUserEmail={@current_user.email}
      serverState={UserStates.initial_server_state()}
      isFallback
    />
    """
  end
end
