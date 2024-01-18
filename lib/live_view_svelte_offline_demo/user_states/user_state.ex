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
    |> validate_state_map_structure()
    |> validate_state_map_timestamp()
    |> validate_state_map_value()
    |> foreign_key_constraint(:user_id)
    |> unique_constraint(:user_id)
  end

  # Check if state map has the correct structure and remove any extra keys.
  defp validate_state_map_structure(changeset) do
    state = changeset |> get_change(:state)

    case state do
      %{"timestamp" => timestamp, "value" => %{"lists" => lists, "todos" => todos}} ->
        changeset
        |> delete_change(:state)
        |> put_change(:state, %{
          "timestamp" => timestamp,
          "value" => %{"lists" => lists, "todos" => todos}
        })

      _ ->
        changeset |> add_error(:state, "state map structure is not valid")
    end
  end

  defp validate_state_map_timestamp(changeset) do
    timestamp = changeset |> get_change(:state) |> Map.get("timestamp")

    case timestamp do
      timestamp when not is_integer(timestamp) ->
        changeset |> add_error(:state, "timestamp must be an integer")

      timestamp when timestamp < 0 ->
        changeset |> add_error(:state, "timestamp must be greater than 0")

      _ ->
        changeset
    end
  end
  def validate_lists(lists) do
    lists
    # Filter out lists that don't have the correct structure.
    |> Enum.filter(fn list ->
      case list do
        %{"id" => id, "name" => name, "isEditing" => is_editing} ->
          is_valid_uuid?(id) &&
            is_binary(name) &&
            String.length(name) <= 1000 &&
            is_editing == true &&
            Map.has_key?(list, "newName") &&
            is_binary(list["newName"]) &&
            String.length(list["newName"]) <= 1000

        %{"id" => id, "name" => name} ->
          is_valid_uuid?(id) &&
            is_binary(name) &&
            String.length(name) <= 1000

        _ ->
          false
      end
    end)
    # Remove lists with duplicate ids.
    |> Enum.uniq_by(& &1["id"])
    # Remove extra keys from list maps.
    |> Enum.map(fn list ->
      case list do
        %{"id" => id, "name" => name, "isEditing" => is_editing, "newName" => new_name} ->
          %{"id" => id, "name" => name, "isEditing" => is_editing, "newName" => new_name}

        %{"id" => id, "name" => name} ->
          %{"id" => id, "name" => name}
      end
    end)
  end

  defp is_valid_id_and_name?(item) do
    is_valid_uuid?(item["id"]) && is_valid_name?(item["name"])
  end

  def is_valid_new_name?(item) do
    Map.has_key?(item, "newName") && is_valid_name?(item["newName"])
  end

  defp is_valid_name?(name) do
    is_binary(name) && String.length(name) <= 1000
  end

  defp is_valid_uuid?(uuid) do
    case Ecto.UUID.dump(uuid) do
      {:ok, _} -> true
      _ -> false
    end
  end
end
