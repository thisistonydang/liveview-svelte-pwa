<script lang="ts">
  import { Check, Share2 } from "lucide-svelte";

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
      <Share2 class="swap-off" />
      <Check class="swap-on" />
    </div>
  </div>
</button>
