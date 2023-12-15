defmodule LiveViewSvelteOfflineDemo.UserStatesTest do
  use LiveViewSvelteOfflineDemo.DataCase

  alias LiveViewSvelteOfflineDemo.Accounts
  alias LiveViewSvelteOfflineDemo.UserStates

  describe "user_states" do
    alias LiveViewSvelteOfflineDemo.UserStates.UserState

    import LiveViewSvelteOfflineDemo.UserStatesFixtures

    @invalid_attrs %{state: nil}

    test "list_user_states/0 returns all user_states" do
      user_state = user_state_fixture()
      assert UserStates.list_user_states() == [user_state]
    end

    test "get_user_state!/1 returns the user_state with given id" do
      user_state = user_state_fixture()
      assert UserStates.get_user_state!(user_state.id) == user_state
    end

    test "create_user_state/1 with valid data creates a user_state" do
      # GIVEN valid data
      {:ok, user} =
        Accounts.register_user(%{email: Faker.Internet.email(), password: "password1234"})

      state = %{"timestamp" => 0, "value" => %{}}
      valid_attrs = %{state: state, user_id: user.id}

      # WHEN we create a UserState
      assert {:ok, %UserState{} = user_state} = UserStates.create_user_state(valid_attrs)

      # THEN a UserState is created
      assert user_state.user_id == user.id
      assert user_state.state == state
    end

    test "create_user_state/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = UserStates.create_user_state(@invalid_attrs)
    end

    test "update_user_state/2 with valid data updates the user_state" do
      user_state = user_state_fixture()
      update_attrs = %{state: %{}}

      assert {:ok, %UserState{} = user_state} =
               UserStates.update_user_state(user_state, update_attrs)

      assert user_state.state == %{}
    end

    test "update_user_state/2 with invalid data returns error changeset" do
      user_state = user_state_fixture()

      assert {:error, %Ecto.Changeset{}} =
               UserStates.update_user_state(user_state, @invalid_attrs)

      assert user_state == UserStates.get_user_state!(user_state.id)
    end

    test "delete_user_state/1 deletes the user_state" do
      user_state = user_state_fixture()
      assert {:ok, %UserState{}} = UserStates.delete_user_state(user_state)
      assert_raise Ecto.NoResultsError, fn -> UserStates.get_user_state!(user_state.id) end
    end

    test "change_user_state/1 returns a user_state changeset" do
      user_state = user_state_fixture()
      assert %Ecto.Changeset{} = UserStates.change_user_state(user_state)
    end
  end
end
