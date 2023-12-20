<script>
  import { fly } from "svelte/transition";
  import { isClientStateRestored, isOnline } from "../lib/offline-svelte";

  import { clickOutside } from "../hooks/clickOutside";
  import { isAccountMenuOpened } from "../stores/clientOnlyState";

  import UserSvgIcon from "./UserSvgIcon.svelte";

  export let currentUserEmail;

  function logOutUser() {
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
      {#if $isOnline}
        <li><a href="/users/settings">Settings</a></li>
        <li><button on:click={logOutUser}>Log out</button></li>
      {:else}
        <li class="w-full tooltip tooltip-bottom" data-tip="You must be online to view settings.">
          <button class="w-full hover:cursor-not-allowed" disabled>Settings</button>
        </li>
        <li class="w-full tooltip tooltip-bottom" data-tip="You must be online to log out.">
          <button class="w-full hover:cursor-not-allowed" disabled>Log out</button>
        </li>
      {/if}
    </ul>
  </div>
</details>
