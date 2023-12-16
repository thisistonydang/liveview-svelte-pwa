# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     LiveViewSvelteOfflineDemo.Repo.insert!(%LiveViewSvelteOfflineDemo.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias LiveViewSvelteOfflineDemo.Repo

alias LiveViewSvelteOfflineDemo.Accounts
alias LiveViewSvelteOfflineDemo.UserStates

Repo.delete_all(Accounts.User)
Repo.delete_all(UserStates.UserState)

# Insert test user(s)
Accounts.register_user(%{email: "test@example.com", password: "password1234"})

# Insert test user_state(s)
state = %{
  "timestamp" => 1_701_807_051_829,
  "value" => %{
    "todo" => [
      %{"id" => "1", "name" => "🍚 Oatmeal"},
      %{"id" => "2", "name" => "🌱 Chia seeds"},
      %{"id" => "3", "name" => "🥛 Milk"},
      %{"id" => "4", "name" => "🍧 Yogurt"},
      %{"id" => "5", "name" => "🧀 Cheese"},
      %{"id" => "6", "name" => "🥜 Nuts"},
      %{"id" => "7", "name" => "🪴 Hemp"}
    ],
    "completed" => [
      %{"id" => "8", "name" => "🍫 Bars"},
      %{"id" => "9", "name" => "🫙 Powder"},
      %{"id" => "10", "name" => "🍌 Banana"},
      %{"id" => "11", "name" => "◻️ Tofu"},
      %{"id" => "12", "name" => "🍋 Lemon Juice"},
      %{"id" => "13", "name" => "🍯 Honey"},
      %{"id" => "14", "name" => "🧂 Salt"}
    ]
  }
}

UserStates.create_user_state(%{state: state, user_id: 1})
