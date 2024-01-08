defmodule LiveViewSvelteOfflineDemoWeb.OfflineHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.ErrorLayout
      title="Whoops, something went wrong or you may be offline..."
      subtitle="Please check your connection or try refreshing."
      href={~p"/"}
      linkText="Refresh"
    />
    """
  end
end
