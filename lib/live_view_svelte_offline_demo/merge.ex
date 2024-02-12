defmodule LiveViewSvelteOfflineDemo.Merge do
  @moduledoc """
  This module is sample code for use in presentation slides and is not used in
  the actual application.
  """

  # state_1 = %{unique_id: 1, timestamp: 1, value: "A"}
  # state_2 = %{unique_id: 2, timestamp: 2, value: "B"}

  # If the timestamps are the same, break the tie with the unique_id.
  def merge(state_1, state_2) when state_1.timestamp == state_2.timestamp do
    if state_1.unique_id > state_2.unique_id, do: state_1, else: state_2
  end

  # Check timestamps. Last write wins.
  def merge(state_1, state_2) do
    if state_1.timestamp > state_2.timestamp, do: state_1, else: state_2
  end

  # IO.inspect(state_1, label: "state_1")
  # IO.inspect(state_2, label: "state_2")
end
