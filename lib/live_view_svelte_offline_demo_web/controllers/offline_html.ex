defmodule LiveViewSvelteOfflineDemoWeb.OfflineHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.ErrorLayout
      title="Whoops, you're currently offline..."
      subtitle="Please try refreshing once you're connected again."
      linkTo={~p"/app"}
      linkText="Refresh"
    />
    """
  end
end
