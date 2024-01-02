defmodule LiveViewSvelteOfflineDemoWeb.AboutHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.sticky_header>
      <.Back />
    </.sticky_header>

    <.AppInfo />
    """
  end
end
