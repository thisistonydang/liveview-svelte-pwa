defmodule LiveViewSvelteOfflineDemo.Repo.Migrations.DropUserStates do
  use Ecto.Migration

  def change do
    drop table("user_states")
  end
end
