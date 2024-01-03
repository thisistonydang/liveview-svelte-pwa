defmodule LiveViewSvelteOfflineDemoWeb.LogoController do
  use LiveViewSvelteOfflineDemoWeb, :controller

  def index(conn, _params) do
    render(conn, :index)
  end
end
