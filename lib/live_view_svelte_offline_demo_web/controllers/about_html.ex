defmodule LiveViewSvelteOfflineDemoWeb.AboutHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.sticky_header>
      <.BackLink linkTo={~p"/app"} />
    </.sticky_header>

    <.app_info></.app_info>
    """
  end
end
