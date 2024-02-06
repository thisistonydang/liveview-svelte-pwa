<script lang="ts">
  import { fly } from "svelte/transition";

  import { clickOutside } from "$lib/actions/clickOutside";
  import InfoSvgIcon from "$lib/svg-icons/InfoSvgIcon.svelte";
  import WarningSvgIcon from "$lib/svg-icons/WarningSvgIcon.svelte";
  import XMarkSvgIcon from "$lib/svg-icons/XMarkSvgIcon.svelte";

  import { toast } from "$stores/toast";

  function dismissToast() {
    $toast = {
      show: false,
      kind: "info",
      title: "",
      msg: "",
    };
  }
</script>

{#if $toast.show}
  <div
    transition:fly={{ x: 50 }}
    role="alert"
    class={`
      fixed top-2 right-2 mr-2 w-80 sm:w-96 z-50 rounded-lg p-3 shadow-md
      ${$toast.kind === "info" && "bg-success text-success-content fill-success"}
      ${$toast.kind === "error" && "bg-error text-error-content fill-error"}
    `}
    use:clickOutside={dismissToast}
  >
    <p class="flex items-center gap-1.5 text-sm font-semibold leading-6">
      {#if $toast.kind === "info"}
        <InfoSvgIcon className="h-4 w-4" />
      {:else if $toast.kind === "error"}
        <WarningSvgIcon className="h-4 w-4" />
      {/if}

      {$toast.title}
    </p>

    <p class="mt-2 text-sm leading-5">{$toast.msg}</p>

    <button class="group absolute top-1 right-1 p-2" aria-label="close" on:click={dismissToast}>
      <XMarkSvgIcon className="w-5 h-5" />
    </button>
  </div>
{/if}
