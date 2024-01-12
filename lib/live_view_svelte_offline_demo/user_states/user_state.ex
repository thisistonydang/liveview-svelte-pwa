defmodule LiveViewSvelteOfflineDemo.UserStates.UserState do
  use Ecto.Schema
  import Ecto.Changeset

  schema "user_states" do
    field :state, :map
    belongs_to :user, LiveViewSvelteOfflineDemo.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user_state, attrs) do
    user_state
    |> cast(attrs, [:state, :user_id])
    |> validate_required([:state, :user_id])
    |> validate_timestamp()
    |> foreign_key_constraint(:user_id)
    |> unique_constraint(:user_id)
  end

  def validate_timestamp(changeset) do
    timestamp = changeset |> get_change(:state) |> Map.get("timestamp")

    case timestamp do
      nil ->
        changeset |> add_error(:state, "'timestamp' key is not present in state map")

      timestamp when not is_integer(timestamp) ->
        changeset |> add_error(:state, "timestamp must be an integer")

      timestamp when timestamp < 0 ->
        changeset |> add_error(:state, "timestamp must be greater than 0")

      _ ->
        changeset
    end
  end
end
