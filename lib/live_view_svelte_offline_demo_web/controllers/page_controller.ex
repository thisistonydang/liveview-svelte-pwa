defmodule LiveViewSvelteOfflineDemoWeb.PageController do
  use LiveViewSvelteOfflineDemoWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
