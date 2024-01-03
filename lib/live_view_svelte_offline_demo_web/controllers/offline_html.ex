defmodule LiveViewSvelteOfflineDemoWeb.OfflineHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.ErrorLayout
      title="Whoops, you may be offline..."
      subtitle="Please check your connection or try refreshing."
      href={~p"/app"}
      linkText="Refresh"
    />
    """
  end
end
