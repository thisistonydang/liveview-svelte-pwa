defmodule LiveViewSvelteOfflineDemo.UserDataTest do
  use LiveViewSvelteOfflineDemo.DataCase

  alias LiveViewSvelteOfflineDemo.UserData

  describe "user_documents" do
    alias LiveViewSvelteOfflineDemo.UserData.UserDocument

    import LiveViewSvelteOfflineDemo.UserDataFixtures

    @invalid_attrs %{document: nil}

    test "list_user_documents/0 returns all user_documents" do
      user_document = user_document_fixture()
      assert UserData.list_user_documents() == [user_document]
    end

    test "get_user_document!/1 returns the user_document with given id" do
      user_document = user_document_fixture()
      assert UserData.get_user_document!(user_document.id) == user_document
    end

    test "create_user_document/1 with valid data creates a user_document" do
      valid_attrs = %{document: "some document"}

      assert {:ok, %UserDocument{} = user_document} = UserData.create_user_document(valid_attrs)
      assert user_document.document == "some document"
    end

    test "create_user_document/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = UserData.create_user_document(@invalid_attrs)
    end

    test "update_user_document/2 with valid data updates the user_document" do
      user_document = user_document_fixture()
      update_attrs = %{document: "some updated document"}

      assert {:ok, %UserDocument{} = user_document} = UserData.update_user_document(user_document, update_attrs)
      assert user_document.document == "some updated document"
    end

    test "update_user_document/2 with invalid data returns error changeset" do
      user_document = user_document_fixture()
      assert {:error, %Ecto.Changeset{}} = UserData.update_user_document(user_document, @invalid_attrs)
      assert user_document == UserData.get_user_document!(user_document.id)
    end

    test "delete_user_document/1 deletes the user_document" do
      user_document = user_document_fixture()
      assert {:ok, %UserDocument{}} = UserData.delete_user_document(user_document)
      assert_raise Ecto.NoResultsError, fn -> UserData.get_user_document!(user_document.id) end
    end

    test "change_user_document/1 returns a user_document changeset" do
      user_document = user_document_fixture()
      assert %Ecto.Changeset{} = UserData.change_user_document(user_document)
    end
  end
end
