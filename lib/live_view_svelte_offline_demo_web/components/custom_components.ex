defmodule LiveViewSvelteOfflineDemoWeb.CustomComponents do
  use Phoenix.Component

  # Allow use of sigil_p/2
  use Phoenix.VerifiedRoutes,
    endpoint: LiveViewSvelteOfflineDemoWeb.Endpoint,
    router: LiveViewSvelteOfflineDemoWeb.Router,
    statics: LiveViewSvelteOfflineDemoWeb.static_paths()

  slot :inner_block, required: true

  def root_html(assigns) do
    ~H"""
    <!DOCTYPE html>
    <html lang="en" class="[scrollbar-gutter:stable]">
      <head>
        <meta charset="UTF-8" />
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
        <script>
          // Set theme in head to avoid FOUC.
          try {
            const theme = JSON.parse(localStorage.getItem("theme"))
            if (["light", "dark"].includes(theme)) {
              document.documentElement.setAttribute("data-theme", theme)
            }
          } catch (error) {
            console.error("Invalid value for 'theme' key in localStorage.", error)
            localStorage.removeItem("theme")
          }
        </script>
      </head>
      <body class="antialiased min-h-screen">
        <%= render_slot(@inner_block) %>
      </body>
    </html>
    """
  end

  slot :inner_block, default: ""

  def app_info(assigns) do
    ~H"""
    <div class="max-w-md mx-auto px-6 md:p-0 mt-10">
      <h1 class="text-5xl font-black my-5">Offline-Enabled LiveView Svelte Demo</h1>
      <p>
        This is a demo of a Phoenix LiveView
        <abbr class="underline-offset-4" title="Progressive WebApp">PWA</abbr>
        that can sync realtime across multiple devices while
        also being able to fallback to working offline.
      </p>

      <div class="my-6">
        <h2 class="text-3xl font-bold my-3">
          It utilizes the following technologies
        </h2>

        <ul class="list-disc pl-4">
          <li>Phoenix LiveView, Presence, and PubSub</li>
          <li>Ecto/PostgreSQL</li>
          <li>Svelte (via live_svelte)</li>
          <li>Service Workers</li>
          <li>LocalStorage</li>
        </ul>
      </div>

      <%= render_slot(@inner_block) %>
    </div>
    """
  end

  slot :inner_block, required: true

  def sticky_header(assigns) do
    ~H"""
    <div class="sticky top-0 left-0 w-full py-1 z-10 bg-base-100 border-neutral border-b h-14">
      <div class="max-w-2xl mx-auto px-2 md:p-0 h-full flex items-center">
        <%= render_slot(@inner_block) %>
      </div>
    </div>
    """
  end

  slot :inner_block, required: true

  def user_auth_layout(assigns) do
    ~H"""
    <div class="max-w-[390px] mx-auto px-2 md:p-0 mt-10">
      <%= render_slot(@inner_block) %>
    </div>
    """
  end
end
