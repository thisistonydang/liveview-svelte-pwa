<script lang="ts">
  import { Check } from "lucide-svelte";

  import type { Live } from "live_svelte";

  export let live: Live = undefined;
  live;
</script>

<div class="h-screen w-screen bg-accent flex justify-center items-center">
  <Check color="#2a323c" class="h-96 w-96" />
</div>
