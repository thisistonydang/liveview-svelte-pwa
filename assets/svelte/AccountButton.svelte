<script lang="ts">
  import { scale } from "svelte/transition";

  import {
    isConnected,
    isClientStateRestored,
    requestAssetDeletion,
    serviceWorkerVersion,
  } from "lib/offline-svelte";
  import UserSvgIcon from "lib/svg-icons/UserSvgIcon.svelte";
  import { showTopBar, hideTopBar } from "lib/topbar";

  import config from "../../priv/static/sw.config.js";
  import { openedMenuId, urlHash } from "../stores/clientOnlyState";
  import { toast } from "../stores/toast";

  export let currentUserEmail: string;
  export let menuClass: string;

  const accountMenuId = "account-menu-id";
  let isLogOutLoading = false;
  let isSettingsLoading = false;
  let disabled = false;

  function showAbout() {
    $urlHash = "about";
    history.pushState({}, "", `/app#${$urlHash}`);
    window.scrollTo(0, 0);
  }

  async function showSettings() {
    disabled = true;
    isSettingsLoading = true;
    showTopBar();

    if (!(await isConnected())) {
      $toast = {
        show: true,
        kind: "error",
        title: "Whoops, can't connect to server...",
        msg: "You must be connected to view settings. Please check your connection or try refreshing.",
      };
      hideTopBar();
      isSettingsLoading = false;
      disabled = false;
      return;
    }

    $openedMenuId = "";
    window.location.href = "/users/settings";
  }

  async function logOutUser() {
    disabled = true;
    isLogOutLoading = true;
    showTopBar();

    if (!(await isConnected())) {
      $toast = {
        show: true,
        kind: "error",
        title: "Whoops, can't connect to server...",
        msg: "You must be connected to logout. Please check your connection or try refreshing.",
      };
      hideTopBar();
      isLogOutLoading = false;
      disabled = false;
      return;
    }

    requestAssetDeletion(config.privateAssets); // Clear cached assets.
    $isClientStateRestored = false; // This stops client state from being saved to localStorage.
    localStorage.clear(); // Clear client state.

    const logOutLink = document.getElementById("log-out-link");
    try {
      logOutLink.click();
    } catch (error) {
      console.error(error);
      alert("Error logging out. Please try again.");
    }
  }
</script>

<div class="{menuClass} relative">
  <button
    class="my-1 btn btn-circle btn-neutral"
    aria-label="Account Menu"
    on:click={() => ($openedMenuId = $openedMenuId === accountMenuId ? "" : accountMenuId)}
  >
    <UserSvgIcon className="h-6 w-6" />
  </button>

  {#if $openedMenuId === accountMenuId}
    <div
      in:scale={{ duration: 100 }}
      class="menu bg-base-200 border border-neutral rounded-box absolute right-0"
    >
      <div class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-1.5">
        {currentUserEmail}
        <div class="text-xs font-normal h-4" class:skeleton={!$serviceWorkerVersion}>
          {$serviceWorkerVersion}
        </div>
      </div>

      <ul>
        <li>
          <a href="/app#about" on:click|preventDefault={showAbout}>About</a>
        </li>
        <li>
          <a
            href="/users/settings"
            on:click|preventDefault={showSettings}
            class:pointer-events-none={disabled}
          >
            Settings
            <span class="loading loading-dots loading-xs" class:hidden={!isSettingsLoading}></span>
          </a>
        </li>
        <li>
          <button on:click={logOutUser} {disabled}>
            Log out
            <span class="loading loading-dots loading-xs" class:hidden={!isLogOutLoading}></span>
          </button>
        </li>
      </ul>
    </div>
  {/if}
</div>
