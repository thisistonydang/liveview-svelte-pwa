defmodule LiveViewSvelteOfflineDemoWeb.AppController do
  use LiveViewSvelteOfflineDemoWeb, :controller

  def index(conn, _params) do
    render(conn, :index,
      hide_socket_flash_messages: true,
      layout: {LiveViewSvelteOfflineDemoWeb.Layouts, :spa}
    )
  end
end
