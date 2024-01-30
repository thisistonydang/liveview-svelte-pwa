defmodule LiveViewSvelteOfflineDemo.Repo.Migrations.CreateUserDocuments do
  use Ecto.Migration

  def change do
    create table(:user_documents) do
      add :document, :text, null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:user_documents, [:user_id])
  end
end
