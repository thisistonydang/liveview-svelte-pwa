defmodule LiveViewSvelteOfflineDemoWeb.AboutHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <!-- Keep theme synced when theme is changed in another tab or window of the same browser. -->
    <.ThemeSyncManager />

    <.sticky_header>
      <.Back />
    </.sticky_header>

    <.AppInfo />
    """
  end
end
