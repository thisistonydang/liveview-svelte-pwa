defmodule LiveViewSvelteOfflineDemoWeb.PageHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def home(assigns) do
    ~H"""
    <div class="sm:my-20">
      <.AppInfo showAuthLinks />
    </div>
    """
  end
end
