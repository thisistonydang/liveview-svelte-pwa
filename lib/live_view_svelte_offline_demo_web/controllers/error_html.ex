defmodule LiveViewSvelteOfflineDemoWeb.ErrorHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def render("404.html", assigns) do
    ~H"""
    <.root_html>
      <.ErrorLayout title="404 - Whoops, page not found..." href={~p"/"} linkText="Return home" />
    </.root_html>
    """
  end

  def render("500.html", assigns) do
    ~H"""
    <.root_html>
      <.ErrorLayout
        title="500 - Whoops, an unknown error has occurred..."
        href={~p"/"}
        linkText="Return home"
      />
    </.root_html>
    """
  end

  # The default is to render a plain text page based on
  # the template name. For example, "404.html" becomes
  # "Not Found".
  def render(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end
