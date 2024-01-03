defmodule LiveViewSvelteOfflineDemoWeb.LogoHTML do
  use LiveViewSvelteOfflineDemoWeb, :html

  def index(assigns) do
    ~H"""
    <.Logo />
    """
  end
end
