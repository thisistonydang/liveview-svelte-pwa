defmodule LiveViewSvelteOfflineDemo.UserStates do
  @moduledoc """
  The UserStates context.
  """

  import Ecto.Query, warn: false
  alias LiveViewSvelteOfflineDemo.Repo

  alias LiveViewSvelteOfflineDemo.UserStates.UserState

  @doc """
  Returns the list of user_states.

  ## Examples

      iex> list_user_states()
      [%UserState{}, ...]

  """
  def list_user_states do
    Repo.all(UserState)
  end

  @doc """
  Gets a single user_state by user_id.

  If user_state does not exist, creates and returns a new user_state.

  ## Examples

      iex> get_user_state(1)
      %UserState{
        user_id: 1,
        state: %{"timestamp" => 1_701_807_051_829, "value" => %{"todo" => [], "completed" => []}
      }

      iex> get_user_state(456)
      %UserState{
        user_id: 456,
        state: %{"timestamp" => 0, "value" => %{"todo" => [], "completed" => []}
      }

  """
  def get_user_state(user_id) do
    # Default state if user_state does not exist.
    state = %{
      "timestamp" => 0,
      "value" => %{"todo" => [], "completed" => []}
    }

    {:ok, user_state} =
      case Repo.get_by(UserState, user_id: user_id) do
        # TODO: Handle case where create_user_state/1 returns {:error, changeset}?
        nil -> create_user_state(%{state: state, user_id: user_id})
        user_state -> {:ok, user_state}
      end

    user_state
  end

  @doc """
  Creates a user_state. A user_id is required.

  ## Examples

      iex> create_user_state(%{state: value, user_id: 1})
      {:ok, %UserState{}}

      iex> create_user_state(%{state: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user_state(attrs \\ %{}) do
    %UserState{}
    |> UserState.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user_state and broadcasts the update to subscribers.

  ## Examples

      iex> update_user_state(user_state, %{state: new_value})
      {:ok, %UserState{}}

      iex> update_user_state(user_state, %{state: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_state(%UserState{} = user_state, attrs) do
    user_state
    |> UserState.changeset(attrs)
    |> Repo.update()
    |> broadcast(:user_state_updated)
  end

  @doc """
  Deletes a user_state.

  ## Examples

      iex> delete_user_state(user_state)
      {:ok, %UserState{}}

      iex> delete_user_state(user_state)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user_state(%UserState{} = user_state) do
    Repo.delete(user_state)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user_state changes.

  ## Examples

      iex> change_user_state(user_state)
      %Ecto.Changeset{data: %UserState{}}

  """
  def change_user_state(%UserState{} = user_state, attrs \\ %{}) do
    UserState.changeset(user_state, attrs)
  end
end
