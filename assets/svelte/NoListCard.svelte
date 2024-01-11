<script>
  import { activeTab } from "../stores/clientOnlyState";
</script>

<div class="mx-auto my-20 xs:w-96 card bg-neutral text-neutral-content">
  <div class="card-body items-center text-center">
    <h2 class="card-title">No lists yet.</h2>

    <p class="mb-1">Please create a list to get started.</p>

    <div class="card-actions">
      <button class="btn btn-accent" on:click={() => ($activeTab = "Lists")}>Create</button>
    </div>
  </div>
</div>
