<script>
  import {
    connectionStatus,
    checkOnlineStatus,
    isClientStateRestored,
    requestAssetDeletion,
  } from "../lib/offline-svelte";

  import { clickOutside } from "../hooks/clickOutside";
  import { isAccountMenuOpened } from "../stores/clientOnlyState";

  import UserSvgIcon from "./UserSvgIcon.svelte";

  export let currentUserEmail;

  let isLogOutLoading = false;
  let isSettingsLoading = false;

  async function logOutUser() {
    isLogOutLoading = true;
    await checkOnlineStatus();

    // TODO: Create alert component.
    if ($connectionStatus !== "Connected") {
      alert("You must be online to log out.");
      isLogOutLoading = false;
      return;
    }

    requestAssetDeletion(["/app", "/fallback"]); // Clear cached assets.
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

  async function showSettings() {
    isSettingsLoading = true;
    await checkOnlineStatus();

    // TODO: Create alert component.
    if ($connectionStatus !== "Connected") {
      alert("You must be online to view settings.");
      isSettingsLoading = false;
      return;
    }

    $isAccountMenuOpened = false;
    window.location.href = "/users/settings";
  }
</script>

<details
  class="dropdown dropdown-end"
  bind:open={$isAccountMenuOpened}
  use:clickOutside={() => ($isAccountMenuOpened = false)}
>
  <summary class="my-1 btn btn-circle btn-neutral" aria-label="Account Menu">
    <UserSvgIcon />
  </summary>

  <div class="dropdown-content menu bg-base-200 border border-neutral rounded-box">
    <p class="px-4 py-2 font-bold border-b border-neutral rounded-none mb-1.5">
      {currentUserEmail}
    </p>

    <ul class="w-56">
      <li>
        <button on:click={showSettings}>
          Settings
          <span class="loading loading-dots loading-xs" class:hidden={!isSettingsLoading}></span>
        </button>
      </li>
      <li>
        <button on:click={logOutUser}>
          Log out
          <span class="loading loading-dots loading-xs" class:hidden={!isLogOutLoading}></span>
        </button>
      </li>
    </ul>
  </div>
</details>
