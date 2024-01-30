defmodule LiveViewSvelteOfflineDemo.Repo.Migrations.CreateUserDocuments do
  use Ecto.Migration

  def change do
    create table(:user_documents) do
      add :document, :text

      timestamps(type: :utc_datetime)
    end
  end
end
