<script lang="ts">
  import CheckSvgIconMicro from "$lib/svg-icons/CheckSvgIconMicro.svelte";
  import ShareSvgIcon from "$lib/svg-icons/ShareSvgIcon.svelte";

  let message: "App link copied!" | "Copy to clipboard failed." | "";

  async function copyAppLink() {
    const url = new URL(window.location.href);

    try {
      await navigator.clipboard.writeText(url.origin);
      message = "App link copied!";
    } catch {
      message = "Copy to clipboard failed.";
    }

    // Clear the tooltip after 2 seconds.
    setTimeout(() => {
      message = "";
    }, 2000);
  }
</script>

<button
  class="
    my-1 btn btn-circle btn-neutral
    focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
  "
  aria-label="Share app link."
  title="Click to copy app link."
  disabled={Boolean(message)}
  on:click={copyAppLink}
>
  <div
    class="tooltip-left tooltip-primary"
    class:tooltip={Boolean(message)}
    class:tooltip-open={Boolean(message)}
    data-tip={message}
  >
    <div class="swap swap-rotate">
      <input type="checkbox" class="hidden" checked={Boolean(message)} />
      <ShareSvgIcon className="swap-off h-6 w-6" />
      <CheckSvgIconMicro className="swap-on h-6 w-6" />
    </div>
  </div>
</button>
