defmodule LiveViewSvelteOfflineDemoWeb.HomeHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <div class="sm:my-20">
      <.AppInfo showAuthLinks />
    </div>
    """
  end
end
