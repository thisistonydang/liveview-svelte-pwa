defmodule LiveViewSvelteOfflineDemoWeb.HomeHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <div class="my-10 sm:my-20">
      <.AppInfo showAuthLinks />
    </div>
    """
  end
end
