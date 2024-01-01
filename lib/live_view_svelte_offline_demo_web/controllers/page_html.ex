defmodule LiveViewSvelteOfflineDemoWeb.PageHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def home(assigns) do
    ~H"""
    <!-- This div is a spacer -->
    <div class="h-14" />

    <.AppInfo showAuthLinks />
    """
  end
end
