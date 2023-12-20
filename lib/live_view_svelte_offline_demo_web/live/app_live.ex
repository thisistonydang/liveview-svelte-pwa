defmodule LiveViewSvelteOfflineDemoWeb.AppLive do
  use LiveViewSvelteOfflineDemoWeb, :live_view

  alias LiveViewSvelteOfflineDemo.UserStates

  # Load Data ______________________________________________________________________________________

  def mount(_params, _session, socket) do
    if connected?(socket), do: UserStates.subscribe(socket.assigns.current_user.id)

    initial_server_state = %{
      "meta" => %{"synced" => false},
      "timestamp" => 0,
      "value" => %{"todo" => [], "completed" => []}
    }

    socket =
      socket
      |> assign(server_state: initial_server_state)
      |> assign(svelte_opts: %{ssr: false})

    {:ok, socket}
  end

  # Render Component _______________________________________________________________________________

  def render(assigns) do
    ~H"""
    <.App currentUserEmail={@current_user.email} serverState={@server_state} />
    """
  end

  # Event Handlers _________________________________________________________________________________

  # TODO: Do this on mount instead?
  def handle_event("request_server_state", _params, socket) do
    socket = socket |> assign(server_state: get_server_state(socket))

    {:noreply, socket}
  end

  def handle_event("client_state_updated", %{"clientState" => client_state}, socket) do
    # Get latest data from db and perform state merge.
    latest_state =
      get_server_state(socket) |> merge_state(client_state) |> confirm_synced(socket)

    socket = socket |> assign(server_state: latest_state)

    {:noreply, socket}
  end

  # Message Handlers _______________________________________________________________________________

  def handle_info({:user_state_updated, user_state}, socket) do
    %{state: state} = user_state
    latest_state = add_synced_timestamp(state)
    socket = socket |> assign(server_state: latest_state)

    {:noreply, socket}
  end

  # Helpers ________________________________________________________________________________________

  defp add_synced_timestamp(state) do
    Map.put(
      state,
      "meta",
      %{"synced" => true, "timestamp" => System.os_time(:millisecond)}
    )
  end

  defp get_server_state(socket) do
    %{state: state} = UserStates.get_user_state(socket.assigns.current_user.id)
    add_synced_timestamp(state)
  end

  defp merge_state(server_state, client_state) do
    if client_state["timestamp"] > server_state["timestamp"], do: client_state, else: server_state
  end

  defp confirm_synced(state, socket) do
    if state["meta"]["synced"] != true, do: sync_to_db(state, socket)

    add_synced_timestamp(state)
  end

  defp sync_to_db(state, socket) do
    new_state = Map.delete(state, "meta")
    old_user_state = UserStates.get_user_state(socket.assigns.current_user.id)

    case UserStates.update_user_state(old_user_state, %{state: new_state}) do
      {:ok, _} -> :ok
      # TODO: Handle this error.
      error -> error
    end
  end
end
