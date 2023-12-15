defmodule LiveViewSvelteOfflineDemoWeb.FallbackHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.App currentUserEmail={@current_user.email} />
    """
  end
end
