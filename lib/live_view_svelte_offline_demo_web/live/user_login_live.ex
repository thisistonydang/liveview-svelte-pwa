defmodule LiveViewSvelteOfflineDemoWeb.UserLoginLive do
  use LiveViewSvelteOfflineDemoWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="hero min-h-screen mx-auto max-w-md">
      <div class="hero-content">
        <div>
          <.BackLink linkTo={~p"/"} linkText="Back" />
          <.header class="text-center">
            Sign in to account
            <:subtitle>
              Don't have an account?
              <.link navigate={~p"/users/register"} class="font-semibold text-accent hover:underline">
                Sign up
              </.link>
              for an account now.
            </:subtitle>
          </.header>

          <.simple_form for={@form} id="login_form" action={~p"/users/log_in"} phx-update="ignore">
            <.input field={@form[:email]} type="email" label="Email" required />
            <.input field={@form[:password]} type="password" label="Password" required />

            <:actions>
              <.input field={@form[:remember_me]} type="checkbox" label="Keep me logged in" />
              <.link href={~p"/users/reset_password"} class="text-sm font-semibold">
                Forgot your password?
              </.link>
            </:actions>
            <:actions>
              <.button phx-disable-with="Signing in..." class="w-full">
                Sign in <span aria-hidden="true">→</span>
              </.button>
            </:actions>
          </.simple_form>
        </div>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    email = live_flash(socket.assigns.flash, :email)
    form = to_form(%{"email" => email}, as: "user")
    {:ok, assign(socket, form: form), temporary_assigns: [form: form]}
  end
end
