defmodule LiveViewSvelteOfflineDemoWeb.CustomComponents do
  use Phoenix.Component

  # Allow use of sigil_p/2
  use Phoenix.VerifiedRoutes,
    endpoint: LiveViewSvelteOfflineDemoWeb.Endpoint,
    router: LiveViewSvelteOfflineDemoWeb.Router,
    statics: LiveViewSvelteOfflineDemoWeb.static_paths()

  attr :title, :string, required: true
  slot :inner_block, default: ""
  attr :link_to, :string, required: true
  attr :link_text, :string, required: true

  def error_layout(assigns) do
    ~H"""
    <div class="hero min-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <div class="my-20 text-8xl">(◑_◑)</div>
          <h1 class="text-xl font-bold my-3"><%= @title %></h1>
          <%= render_slot(@inner_block) %>
          <.link href={@link_to} class="btn btn-accent my-2 uppercase">
            <%= @link_text %>
          </.link>
        </div>
      </div>
    </div>
    """
  end

  slot :inner_block, required: true

  def root_html(assigns) do
    ~H"""
    <!DOCTYPE html>
    <html lang="en" class="[scrollbar-gutter:stable]">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <!-- Favicons -->
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00ccb7" />
        <meta name="apple-mobile-web-app-title" content="ToDo" />
        <meta name="application-name" content="ToDo" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#1d232a" />
        <!-- End Favicons -->
        <meta name="csrf-token" content={Phoenix.Controller.get_csrf_token()} />
        <.live_title suffix=" · Offline-Enabled LiveView Svelte Demo">
          ToDo
        </.live_title>
        <meta name="description" content="Offline-Enabled LiveView Svelte Demo App" />
        <link phx-track-static rel="stylesheet" href={~p"/assets/app.css"} />
        <script defer phx-track-static type="text/javascript" src={~p"/assets/app.js"}>
        </script>
      </head>
      <body class="antialiased">
        <%= render_slot(@inner_block) %>
      </body>
    </html>
    """
  end
end
