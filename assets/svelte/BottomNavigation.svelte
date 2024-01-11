<script>
  import CheckSvgIconMicro from "lib/svg-icons/CheckSvgIconMicro.svelte";
  import ListBulletSvgIcon from "lib/svg-icons/ListBulletSvgIcon.svelte";

  import { activeTab } from "../stores/clientOnlyState";
</script>

<div class="btm-nav max-w-2xl mx-auto">
  <button
    class="bg-base-200"
    class:active={$activeTab === "To-Do"}
    on:click={() => ($activeTab = "To-Do")}
  >
    <CheckSvgIconMicro className="w-5 h-5" />
    <span class="btm-nav-label">To-Do</span>
  </button>

  <button
    class="bg-base-200"
    class:active={$activeTab === "Lists"}
    on:click={() => ($activeTab = "Lists")}
  >
    <ListBulletSvgIcon className="w-5 h-5" />
    <span class="btm-nav-label">Lists</span>
  </button>
</div>
