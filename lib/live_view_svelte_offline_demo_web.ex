defmodule LiveViewSvelteOfflineDemoWeb do
  @moduledoc """
  The entrypoint for defining your web interface, such
  as controllers, components, channels, and so on.

  This can be used in your application as:

      use LiveViewSvelteOfflineDemoWeb, :controller
      use LiveViewSvelteOfflineDemoWeb, :html

  The definitions below will be executed for every controller,
  component, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below. Instead, define additional modules and import
  those modules here.
  """

  def static_paths, do: ~w(
    assets
    fonts
    images
    favicon.ico
    robots.txt
    sw.js
    sw.config.js
    android-chrome-192x192.png
    android-chrome-512x512.png
    apple-touch-icon.png
    browserconfig.xml
    favicon-16x16.png
    favicon-32x32.png
    mstile-150x150.png
    og.png
    safari-pinned-tab.svg
    screenshot-narrow-light.png
    screenshot-narrow-dark.png
    screenshot-wide-light.png
    screenshot-wide-dark.png
    site.webmanifest
  )

  def router do
    quote do
      use Phoenix.Router, helpers: false

      # Import common connection and controller functions to use in pipelines
      import Plug.Conn
      import Phoenix.Controller
      import Phoenix.LiveView.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
    end
  end

  def controller do
    quote do
      use Phoenix.Controller,
        formats: [:html, :json],
        layouts: [html: LiveViewSvelteOfflineDemoWeb.Layouts]

      import Plug.Conn
      import LiveViewSvelteOfflineDemoWeb.Gettext

      unquote(verified_routes())
    end
  end

  def live_view do
    quote do
      use Phoenix.LiveView,
        layout: {LiveViewSvelteOfflineDemoWeb.Layouts, :app}

      unquote(html_helpers())
    end
  end

  def live_component do
    quote do
      use Phoenix.LiveComponent

      unquote(html_helpers())
    end
  end

  def html do
    quote do
      use Phoenix.Component

      # Import convenience functions from controllers
      import Phoenix.Controller,
        only: [get_csrf_token: 0, view_module: 1, view_template: 1]

      # Include general helpers for rendering HTML
      unquote(html_helpers())
    end
  end

  defp html_helpers do
    quote do
      # HTML escaping functionality
      import Phoenix.HTML
      # Core UI components and translation
      import LiveViewSvelteOfflineDemoWeb.CoreComponents
      import LiveViewSvelteOfflineDemoWeb.Gettext
      # Include custom components
      import LiveViewSvelteOfflineDemoWeb.CustomComponents
      # Include LiveSvelte components
      use LiveSvelte.Components

      # Shortcut for generating JS commands
      alias Phoenix.LiveView.JS

      # Routes generation with the ~p sigil
      unquote(verified_routes())
    end
  end

  def verified_routes do
    quote do
      use Phoenix.VerifiedRoutes,
        endpoint: LiveViewSvelteOfflineDemoWeb.Endpoint,
        router: LiveViewSvelteOfflineDemoWeb.Router,
        statics: LiveViewSvelteOfflineDemoWeb.static_paths()
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
