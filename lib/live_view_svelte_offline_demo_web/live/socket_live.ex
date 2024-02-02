defmodule LiveViewSvelteOfflineDemoWeb.SocketLive do
  use LiveViewSvelteOfflineDemoWeb, :live_view

  alias LiveViewSvelteOfflineDemo.UserStates
  alias LiveViewSvelteOfflineDemo.UserData
  alias LiveViewSvelteOfflineDemoWeb.Presence

  # Load Data ______________________________________________________________________________________

  on_mount {LiveViewSvelteOfflineDemoWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    %{id: user_id} = socket.assigns.current_user

    if connected?(socket) do
      # Subscribe to user document updates.
      UserData.subscribe(user_id)

      # Subscribe to user state updates.
      UserStates.subscribe(user_id)

      # Subscribe to presence updates for the user.
      Presence.subscribe(user_id)
    end

    socket =
      socket
      |> assign(svelte_opts: %{ssr: false})
      # TODO: Maybe check for existing document in db and assign it here for faster load times?
      |> assign(server_document: %{"event" => "mount", "document" => nil})
      |> assign(server_state: UserStates.initial_server_state())
      |> assign(session_count: Presence.get_session_count(socket))

    {:ok, socket, layout: false}
  end

  # Render Component _______________________________________________________________________________

  @impl true
  def render(assigns) do
    ~H"""
    <.LiveViewSocket
      server_document={@server_document}
      server_state={@server_state}
      session_count={@session_count}
    />
    <!-- Toggle visibility of the sessions badge when the socket is connected/disconnected. -->
    <div
      phx-connected={JS.remove_class("hidden", to: "#sessions-badge")}
      phx-disconnected={JS.add_class("hidden", to: "#sessions-badge")}
    />
    """
  end

  # Event Handlers _________________________________________________________________________________

  @impl true
  def handle_event("request_server_document" = event, _params, socket) do
    document = UserData.get_document(socket)
    socket = socket |> assign(server_document: %{"event" => event, "document" => document})

    {:noreply, socket}
  end

  def handle_event("create_server_document" = event, %{"document" => document}, socket) do
    UserData.create_user_document!(%{document: document, user_id: socket.assigns.current_user.id})
    socket = socket |> assign(server_document: %{"event" => event, "document" => document})

    {:noreply, socket}
  end

  def handle_event("client_document_updated", %{"document" => document}, socket) do
    # TODO: Get latest document state by merging Yjs updates.
    latest_document = document

    # Save the latest document to the db and broadcast to all clients.
    # TODO: Handle errors.
    old_user_document = UserData.get_user_document_by_user_id(socket.assigns.current_user.id)
    UserData.update_user_document(old_user_document, %{document: latest_document})

    {:noreply, socket}
  end

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

  def handle_event(
        "visibility_change",
        %{"sessionId" => session_id, "visibilityState" => visibility_state},
        socket
      ) do
    case visibility_state do
      "visible" -> Presence.track_user_presence(socket, session_id)
      _ -> Presence.untrack_user_presence(socket)
    end

    {:noreply, socket}
  end

  # Message Handlers _______________________________________________________________________________

  @impl true
  def handle_info({:user_document_updated, user_document}, socket) do
    %{document: document} = user_document

    socket =
      socket
      |> assign(
        server_document: %{
          # A timestamp is included here in order to always trigger a re-render.
          # This is required because the server_document is a prop and the
          # LiveView will not re-render if the prop is the same. This is
          # necessary for the case where the user presses the sync button but
          # the document has not changed.
          "timestamp" => System.os_time(:millisecond),
          "event" => "user_document_updated",
          "document" => document
        }
      )

    {:noreply, socket}
  end

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
    socket = socket |> assign(session_count: Presence.get_session_count(socket))

    {:noreply, socket}
  end

  # Clean Up _______________________________________________________________________________________

  @impl true
  def terminate(_reason, socket) do
    Presence.untrack_user_presence(socket)
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
end
