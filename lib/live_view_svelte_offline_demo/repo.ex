defmodule LiveViewSvelteOfflineDemo.Repo do
  use Ecto.Repo,
    otp_app: :live_view_svelte_offline_demo,
    adapter: Ecto.Adapters.Postgres
end
