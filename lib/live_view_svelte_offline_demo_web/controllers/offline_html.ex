defmodule LiveViewSvelteOfflineDemoWeb.OfflineHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.ErrorLayout
      title="Whoops, can't connect to server..."
      subtitle="Please check your connection or try refreshing."
      href={~p"/"}
      linkText="Refresh"
    />
    """
  end
end
