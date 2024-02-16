<script>
  export let count;

  let clientOnlyCount = count;
</script>

<button phx-click="increment">
  {count}
</button>

<button on:click={() => clientOnlyCount++}>
  {clientOnlyCount}
</button>

<style>
  button {
    margin: 10px;
    padding: 10px;
    display: block;
    border: 1px solid #ccc;
  }
</style>
