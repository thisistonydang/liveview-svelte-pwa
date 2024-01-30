defmodule LiveViewSvelteOfflineDemo.UserDataFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `LiveViewSvelteOfflineDemo.UserData` context.
  """

  @doc """
  Generate a user_document.
  """
  def user_document_fixture(attrs \\ %{}) do
    {:ok, user_document} =
      attrs
      |> Enum.into(%{
        document: "some document"
      })
      |> LiveViewSvelteOfflineDemo.UserData.create_user_document()

    user_document
  end
end
