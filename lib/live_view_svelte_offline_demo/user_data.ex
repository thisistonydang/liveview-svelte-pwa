defmodule LiveViewSvelteOfflineDemo.UserData do
  @moduledoc """
  The UserData context.
  """

  import Ecto.Query, warn: false
  alias LiveViewSvelteOfflineDemo.Repo

  alias LiveViewSvelteOfflineDemo.UserData.UserDocument

  @doc """
  Returns the list of user_documents.

  ## Examples

      iex> list_user_documents()
      [%UserDocument{}, ...]

  """
  def list_user_documents do
    Repo.all(UserDocument)
  end

  @doc """
  Gets a single user_document.

  Raises `Ecto.NoResultsError` if the User document does not exist.

  ## Examples

      iex> get_user_document!(123)
      %UserDocument{}

      iex> get_user_document!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user_document!(id), do: Repo.get!(UserDocument, id)

  @doc """
  Creates a user_document.

  ## Examples

      iex> create_user_document(%{field: value})
      {:ok, %UserDocument{}}

      iex> create_user_document(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user_document(attrs \\ %{}) do
    %UserDocument{}
    |> UserDocument.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user_document.

  ## Examples

      iex> update_user_document(user_document, %{field: new_value})
      {:ok, %UserDocument{}}

      iex> update_user_document(user_document, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_document(%UserDocument{} = user_document, attrs) do
    user_document
    |> UserDocument.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user_document.

  ## Examples

      iex> delete_user_document(user_document)
      {:ok, %UserDocument{}}

      iex> delete_user_document(user_document)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user_document(%UserDocument{} = user_document) do
    Repo.delete(user_document)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user_document changes.

  ## Examples

      iex> change_user_document(user_document)
      %Ecto.Changeset{data: %UserDocument{}}

  """
  def change_user_document(%UserDocument{} = user_document, attrs \\ %{}) do
    UserDocument.changeset(user_document, attrs)
  end
end
