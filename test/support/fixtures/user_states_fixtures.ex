defmodule LiveViewSvelteOfflineDemo.UserStatesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `LiveViewSvelteOfflineDemo.UserStates` context.
  """

  @doc """
  Generate a user_state.
  """
  def user_state_fixture(attrs \\ %{}) do
    {:ok, user_state} =
      attrs
      |> Enum.into(%{
        state: %{}
      })
      |> LiveViewSvelteOfflineDemo.UserStates.create_user_state()

    user_state
  end
end
