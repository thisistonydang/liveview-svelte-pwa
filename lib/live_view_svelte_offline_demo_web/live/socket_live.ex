defmodule LiveViewSvelteOfflineDemoWeb.SocketLive do
  use LiveViewSvelteOfflineDemoWeb, :live_view

  alias LiveViewSvelteOfflineDemoWeb.Presence
  alias LiveViewSvelteOfflineDemo.UserStates

  # Load Data ______________________________________________________________________________________

  on_mount {LiveViewSvelteOfflineDemoWeb.UserAuth, :ensure_authenticated}

  def mount(_params, _session, socket) do
    %{id: user_id} = socket.assigns.current_user

    if connected?(socket) do
      # Subscribe to user state updates.
      UserStates.subscribe(user_id)

      # Track and subscribe to presence updates for the user.
      track_user_presence(socket)
      Phoenix.PubSub.subscribe(LiveViewSvelteOfflineDemo.PubSub, presence_topic(user_id))
    end

    socket =
      socket
      |> assign(svelte_opts: %{ssr: false})
      |> assign(server_state: UserStates.initial_server_state())
      |> assign(session_count: get_session_count(socket))

    {:ok, socket, layout: false}
  end

  # Render Component _______________________________________________________________________________

  def render(assigns) do
    ~H"""
    <.LiveViewSocket server_state={@server_state} session_count={@session_count} />
    """
  end

  # Event Handlers _________________________________________________________________________________

  @doc """
  Only allow the client to request the server state after socket is connected to
  avoid caching user data in service worker cache.
  """
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

  @doc """
  Get and assign the latest session count to the socket whenever a 'presence diff' event is broadcasted.
  """
  def handle_info(%{event: "presence_diff"}, socket) do
    socket = socket |> assign(session_count: get_session_count(socket))

    {:noreply, socket}
  end

  # State Syncing Helpers __________________________________________________________________________

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

  # Session Tracking Helpers _______________________________________________________________________

  # Return count of sessions for the current user in the socket.
  defp get_session_count(socket) do
    %{id: user_id} = socket.assigns.current_user
    presences = Presence.list(presence_topic(user_id))
    user_id_as_string = to_string(user_id)

    case Map.has_key?(presences, user_id_as_string) do
      true ->
        %{^user_id_as_string => %{metas: metas}} = presences
        length(metas)

      _ ->
        0
    end
  end

  # Returns the presence topic for a given user_id.
  defp presence_topic(user_id), do: "presence:user_id:#{user_id}"

  @doc """
  Track the presence of the current user in the socket.
  """
  def track_user_presence(socket) do
    %{id: user_id} = socket.assigns.current_user
    Presence.track(self(), presence_topic(user_id), user_id, %{})
  end
end
