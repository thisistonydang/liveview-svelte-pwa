defmodule LiveViewSvelteOfflineDemoWeb.ErrorHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def render("404.html", assigns) do
    ~H"""
    <.root_html>
      <.error_layout title="404 - Whoops, page not found..." />
    </.root_html>
    """
  end

  def render("500.html", assigns) do
    ~H"""
    <.root_html>
      <.error_layout title="500 - Whoops, an unknown error has occurred..." />
    </.root_html>
    """
  end

  # The default is to render a plain text page based on
  # the template name. For example, "404.html" becomes
  # "Not Found".
  def render(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end

  defp error_layout(assigns) do
    ~H"""
    <div class="hero min-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <div class="my-20 text-8xl">(◑_◑)</div>
          <h1 class="text-lg my-3"><%= @title %></h1>
          <a class="link link-accent underline-offset-4 hover:no-underline" href="/">
            &larr; Return home
          </a>
        </div>
      </div>
    </div>
    """
  end
end
