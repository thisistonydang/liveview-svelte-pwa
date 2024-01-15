defmodule LiveViewSvelteOfflineDemoWeb.UserConfirmationLive do
  use LiveViewSvelteOfflineDemoWeb, :live_view

  alias LiveViewSvelteOfflineDemo.Accounts

  def render(%{live_action: :edit} = assigns) do
    ~H"""
    <.sticky_header>
      <.Back showTopBarOnNav href={~p"/"} />
    </.sticky_header>

    <.user_auth_layout>
      <.header class="text-center">Confirm Account</.header>

      <.simple_form for={@form} id="confirmation_form" phx-submit="confirm_account">
        <.input field={@form[:token]} type="hidden" />
        <:actions>
          <div class="w-full mb-8">
            <.button phx-disable-with="Confirming..." class="w-full">Confirm my account</.button>
          </div>
        </:actions>
      </.simple_form>
    </.user_auth_layout>
    """
  end

  def mount(%{"token" => token}, _session, socket) do
    form = to_form(%{"token" => token}, as: "user")
    {:ok, assign(socket, form: form), temporary_assigns: [form: nil]}
  end

  # Do not log in the user after confirmation to avoid a
  # leaked token giving the user access to the account.
  def handle_event("confirm_account", %{"user" => %{"token" => token}}, socket) do
    case Accounts.confirm_user(token) do
      {:ok, _} ->
        {:noreply,
         socket
         |> put_flash(:info, "User confirmed successfully.")
         |> redirect(to: ~p"/")}

      :error ->
        # If there is a current user and the account was already confirmed,
        # then odds are that the confirmation link was already visited, either
        # by some automation or by the user themselves, so we redirect without
        # a warning message.
        case socket.assigns do
          %{current_user: %{confirmed_at: confirmed_at}} when not is_nil(confirmed_at) ->
            {:noreply, redirect(socket, to: ~p"/")}

          %{} ->
            {:noreply,
             socket
             |> put_flash(:error, "User confirmation link is invalid or it has expired.")
             |> redirect(to: ~p"/")}
        end
    end
  end
end
