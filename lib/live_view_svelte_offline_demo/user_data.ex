defmodule LiveViewSvelteOfflineDemo.UserData do
  @moduledoc """
  The UserData context.
  """

  import Ecto.Query, warn: false

  alias LiveViewSvelteOfflineDemo.Repo
  alias LiveViewSvelteOfflineDemo.UserData.UserDocument

  # PubSub _________________________________________________________________________________________

  @topic "user_document"

  @doc """
  Subscribe to user_document updates for a given user_id.
  """
  def subscribe(user_id) do
    Phoenix.PubSub.subscribe(LiveViewSvelteOfflineDemo.PubSub, "#{@topic}:#{user_id}")
  end

  @doc """
  Broadcast to subscribers of a user_document.
  If an error is passed to broadcast/2, the error is returned.
  """
  def broadcast({:ok, user_document}, tag) do
    Phoenix.PubSub.broadcast(
      LiveViewSvelteOfflineDemo.PubSub,
      "#{@topic}:#{user_document.user_id}",
      {tag, user_document}
    )

    {:ok, user_document}
  end

  def broadcast({:error, changeset}, _tag), do: {:error, changeset}

  # CRUD ___________________________________________________________________________________________

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
  Gets a single user_document by user_id.

  If a user_document does not exist, return nil.
  """
  def get_user_document_by_user_id(user_id) do
    Repo.get_by(UserDocument, user_id: user_id)
  end

  @doc """
  Get base64 document for the current user in a socket.

  Returns nil if no document exists.
  """
  def get_document(socket) do
    user_id = socket.assigns.current_user.id

    case Repo.get_by(UserDocument, user_id: user_id) do
      nil -> nil
      %{document: document} -> document
    end
  end

  @doc """
  Creates a user_document. A user_id is required.

  ## Examples

      iex> create_user_document(%{document: value, user_id: 1})
      {:ok, %UserDocument{}}

      iex> create_user_document(%{document: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user_document(attrs \\ %{}) do
    %UserDocument{}
    |> UserDocument.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Same as `create_user_document/1`, but raises if the changeset is invalid.
  """
  def create_user_document!(attrs \\ %{}) do
    %UserDocument{}
    |> UserDocument.changeset(attrs)
    |> Repo.insert!()
  end

  @doc """
  Updates a user_document and broadcasts the update to subscribers.

  ## Examples

      iex> update_user_document(user_document, %{document: new_value})
      {:ok, %UserDocument{}}

      iex> update_user_document(user_document, %{document: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_document(%UserDocument{} = user_document, attrs) do
    user_document
    |> UserDocument.changeset(attrs)
    |> Repo.update()
    |> broadcast(:user_document_updated)
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
