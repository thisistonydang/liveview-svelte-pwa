defmodule LiveViewSvelteOfflineDemoWeb.Presence do
  @moduledoc """
  Provides presence tracking to channels and processes.

  See the [`Phoenix.Presence`](https://hexdocs.pm/phoenix/Phoenix.Presence.html)
  docs for more details.
  """
  use Phoenix.Presence,
    otp_app: :live_view_svelte_offline_demo,
    pubsub_server: LiveViewSvelteOfflineDemo.PubSub

  # Public API _____________________________________________________________________________________

  @doc """
  Return count of sessions for the current user in the socket.
  """
  def get_session_count(socket) do
    %{id: user_id} = socket.assigns.current_user
    presences = list(presence_topic(user_id))
    user_id_as_string = to_string(user_id)

    case Map.has_key?(presences, user_id_as_string) do
      true ->
        %{^user_id_as_string => %{metas: metas}} = presences
        # Get session count by counting unique sessions_id's. This prevents
        # zombie sessions from skewing the count.
        metas |> Enum.uniq_by(& &1.session_id) |> length()

      _ ->
        0
    end
  end

  @doc """
  Subscribe to presence updates for the given user id.
  """
  def subscribe(user_id) do
    Phoenix.PubSub.subscribe(LiveViewSvelteOfflineDemo.PubSub, presence_topic(user_id))
  end

  @doc """
  Track the presence of the current user in the socket.
  """
  def track_user_presence(socket, session_id) do
    %{id: user_id} = socket.assigns.current_user
    track(self(), presence_topic(user_id), user_id, %{session_id: session_id})
  end

  @doc """
  Untrack user presence.
  """
  def untrack_user_presence(socket) do
    %{id: user_id} = socket.assigns.current_user
    untrack(self(), presence_topic(user_id), user_id)
  end

  # Private Helpers ________________________________________________________________________________

  # Returns the presence topic for a given user_id.
  defp presence_topic(user_id), do: "presence:user_id:#{user_id}"
end
