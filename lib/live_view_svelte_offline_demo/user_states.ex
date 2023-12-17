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

  Raises `Ecto.NoResultsError` if the User state does not exist.

  ## Examples

      iex> get_user_state!(1)
      %UserState{}

      iex> get_user_state!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user_state!(user_id), do: Repo.get_by!(UserState, user_id: user_id)

  @doc """
  Creates a user_state.

  ## Examples

      iex> create_user_state(%{field: value})
      {:ok, %UserState{}}

      iex> create_user_state(%{field: bad_value})
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
