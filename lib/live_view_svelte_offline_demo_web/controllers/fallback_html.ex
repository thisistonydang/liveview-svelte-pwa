defmodule LiveViewSvelteOfflineDemoWeb.FallbackHTML do
  use LiveViewSvelteOfflineDemoWeb, :html
  use LiveSvelte.Components

  def index(assigns) do
    ~H"""
    <.App currentUserEmail={@current_user.email} />
    """
  end
end
