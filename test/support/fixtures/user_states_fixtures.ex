defmodule LiveViewSvelteOfflineDemo.UserStatesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `LiveViewSvelteOfflineDemo.UserStates` context.
  """

  alias LiveViewSvelteOfflineDemo.Accounts
  alias LiveViewSvelteOfflineDemo.UserStates

  @doc """
  Generate a user_state.
  """
  def user_state_fixture(
        state \\ %{
          "timestamp" => System.os_time(:millisecond),
          "value" => %{todo: [], completed: []}
        }
      ) do
    {:ok, user} =
      Accounts.register_user(%{
        email: Faker.Internet.email(),
        password: Faker.String.base64(16)
      })

    {:ok, user_state} = UserStates.create_user_state(%{state: state, user_id: user.id})

    user_state
  end
end
