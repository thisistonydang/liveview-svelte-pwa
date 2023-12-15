defmodule LiveViewSvelteOfflineDemo.Repo.Migrations.CreateUserStates do
  use Ecto.Migration

  def change do
    create table(:user_states) do
      add :state, :map
      add :user_id, references(:users, on_delete: :nothing)

      timestamps(type: :utc_datetime)
    end

    create index(:user_states, [:user_id])
  end
end
