defmodule LiveViewSvelteOfflineDemo.UserData.UserDocument do
  @moduledoc """
  Schema for user_documents table. Stores Yjs documents for each user encoded as
  base64 strings.
  """

  use Ecto.Schema
  import Ecto.Changeset

  schema "user_documents" do
    field :document, :string
    belongs_to :user, LiveViewSvelteOfflineDemo.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user_document, attrs) do
    user_document
    |> cast(attrs, [:document, :user_id])
    |> validate_required([:document, :user_id])
    |> foreign_key_constraint(:user_id)
    |> unique_constraint(:user_id)
  end
end
