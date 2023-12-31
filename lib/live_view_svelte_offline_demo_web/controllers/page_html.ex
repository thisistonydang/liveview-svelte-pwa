defmodule LiveViewSvelteOfflineDemoWeb.PageHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def home(assigns) do
    ~H"""
    <.app_info>
      <:post_info>
        <h2 class="text-3xl font-bold my-3">
          Register or log in to try it out
        </h2>

        <ul class="flex gap-2">
          <li>
            <a href={~p"/users/register"} class="btn btn-accent border border-neutral">Register</a>
          </li>
          <li>
            <a href={~p"/users/log_in"} class="btn btn-accent border border-neutral">Log in</a>
          </li>
        </ul>
      </:post_info>
    </.app_info>
    """
  end
end
