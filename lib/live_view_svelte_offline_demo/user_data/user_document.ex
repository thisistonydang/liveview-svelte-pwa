defmodule LiveViewSvelteOfflineDemo.UserData.UserDocument do
  use Ecto.Schema
  import Ecto.Changeset

  schema "user_documents" do
    field :document, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user_document, attrs) do
    user_document
    |> cast(attrs, [:document])
    |> validate_required([:document])
  end
end
