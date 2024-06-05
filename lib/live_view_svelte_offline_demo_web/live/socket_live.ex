defmodule LiveViewSvelteOfflineDemoWeb.SocketLive do
  @moduledoc """
  This LiveView is embedded inside the AppHTML DeadView and acts as the web
  socket for the Todo application.
  """

  use LiveViewSvelteOfflineDemoWeb, :live_view

  alias LiveViewSvelteOfflineDemo.UserData
  alias LiveViewSvelteOfflineDemoWeb.Presence

  # Load Data ______________________________________________________________________________________

  on_mount {LiveViewSvelteOfflineDemoWeb.UserAuth, :ensure_authenticated}

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      %{id: user_id} = socket.assigns.current_user

      # Subscribe to user document updates.
      UserData.subscribe(user_id)

      # Subscribe to presence updates for the user.
      Presence.subscribe(user_id)
    end

    socket =
      socket
      |> assign(svelte_opts: %{ssr: false})
      |> assign(server_document: %{"event" => "mount", "document" => nil})
      |> assign(session_count: Presence.get_session_count(socket))

    {:ok, socket, layout: false}
  end

  # Render Component _______________________________________________________________________________

  @impl true
  def render(assigns) do
    ~H"""
    <.LiveViewSocket server_document={@server_document} session_count={@session_count} />
    <!-- Toggle visibility of the sessions badge when the socket is connected/disconnected. -->
    <div
      phx-connected={JS.remove_class("hidden", to: "#sessions-badge")}
      phx-disconnected={JS.add_class("hidden", to: "#sessions-badge")}
    />
    <%!-- Dispatch 'phx-disconnected' event to be handled in syncState store. --%>
    <div phx-disconnected={JS.dispatch("phx-disconnected")} />
    """
  end

  # Event Handlers _________________________________________________________________________________

  @impl true
  # Only allow the client to request the document state after socket is
  # connected to avoid caching user data in service worker cache.
  def handle_event("request_server_document" = event, _params, socket) do
    document = UserData.get_document(socket)
    socket = socket |> assign(server_document: %{"event" => event, "document" => document})

    {:noreply, socket}
  end

  def handle_event("create_server_document" = event, %{"document" => document}, socket) do
    UserData.create_user_document!(%{document: document, user_id: socket.assigns.current_user.id})
    socket = socket |> assign(server_document: %{"event" => event, "document" => document})

    {:reply, %{ok: true}, socket}
  end

  def handle_event("client_document_updated", %{"document" => document}, socket) do
    # Save the latest document to the db and broadcast to all clients.
    # TODO: Handle errors.
    old_user_document = UserData.get_user_document_by_user_id(socket.assigns.current_user.id)
    UserData.update_user_document(old_user_document, %{document: document})

    {:reply, %{ok: true}, socket}
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
      |> assign(server_document: %{"event" => "user_document_updated", "document" => document})

    {:noreply, socket}
  end

  # Get and assign the latest session count to the socket whenever a
  # 'presence diff' event is broadcasted.
  def handle_info(%{event: "presence_diff"}, socket) do
    socket = socket |> assign(session_count: Presence.get_session_count(socket))

    {:noreply, socket}
  end
end
