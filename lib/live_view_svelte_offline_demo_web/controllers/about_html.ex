defmodule LiveViewSvelteOfflineDemoWeb.AboutHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.app_info>
      <:pre_info>
        <.BackLink linkTo={~p"/app"} linkText="Back" />
      </:pre_info>
    </.app_info>
    """
  end
end
