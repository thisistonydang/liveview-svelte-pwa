<script lang="ts">
  import CheckSvgIconMicro from "lib/svg-icons/CheckSvgIconMicro.svelte";

  import type { Live } from "live_svelte";

  export let live: Live = undefined;
  live;
</script>

<div class="h-screen w-screen bg-accent flex justify-center items-center">
  <CheckSvgIconMicro fill="#2a323c" className="h-96 w-96" />
</div>
