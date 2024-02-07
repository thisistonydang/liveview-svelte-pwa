defmodule LiveViewSvelteOfflineDemo.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # {NodeJS.Supervisor, [path: LiveSvelte.SSR.NodeJS.server_path(), pool_size: 4]},
      LiveViewSvelteOfflineDemoWeb.Telemetry,
      LiveViewSvelteOfflineDemo.Repo,
      {DNSCluster,
       query: Application.get_env(:live_view_svelte_offline_demo, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: LiveViewSvelteOfflineDemo.PubSub},
      LiveViewSvelteOfflineDemoWeb.Presence,
      # Start the Finch HTTP client for sending emails
      {Finch, name: LiveViewSvelteOfflineDemo.Finch},
      # Start a worker by calling: LiveViewSvelteOfflineDemo.Worker.start_link(arg)
      # {LiveViewSvelteOfflineDemo.Worker, arg},
      # Start to serve requests, typically the last entry
      LiveViewSvelteOfflineDemoWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: LiveViewSvelteOfflineDemo.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LiveViewSvelteOfflineDemoWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
