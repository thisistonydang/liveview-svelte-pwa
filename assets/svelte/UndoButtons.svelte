<script lang="ts">
  import { Redo2, Undo2 } from "lucide-svelte";

  import { liveView } from "$stores/liveViewSocket";
  import { syncDocumentToServer } from "./StateManagement.svelte";

  import type { UndoManager } from "yjs";

  export let undoManager: UndoManager;

  let width: number;
  let undoCount = 0;
  let redoCount = 0;

  $: if (undoManager) {
    undoManager.on("stack-item-added", (event) => {
      console.log("add event:", event);
      undoCount = undoManager.undoStack.length;
      redoCount = undoManager.redoStack.length;
    });

    undoManager.on("stack-item-popped", (event) => {
      console.log("pop event:", event);
      // TODO: track current selected list and URL hash?
    });
  }
</script>

<div
  style="scrollbar-gutter: stable;"
  class="flex gap-2 fixed left-1/2 bottom-0 z-40 m-2"
  bind:clientWidth={width}
  style:margin-left={`-${width / 2}px`}
>
  <div class="indicator">
    {#if undoCount > 0}
      <span class="indicator-item badge badge-sm">{undoCount}</span>
    {/if}

    <button
      class="
        my-1 btn btn-circle btn-neutral shadow-2xl
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      aria-label="Undo."
      title="Undo last action."
      disabled={undoCount === 0}
      on:click={() => {
        undoManager.undo();
        syncDocumentToServer($liveView);
      }}
    >
      <Undo2 className="w-6 h-6" />
    </button>
  </div>

  <div class="indicator">
    {#if redoCount > 0}
      <span class="indicator-item badge badge-sm">{redoCount}</span>
    {/if}

    <button
      class="
        my-1 btn btn-circle btn-neutral
        focus:outline-none focus-visible:ring ring-accent ring-offset-1 ring-offset-base-100
      "
      aria-label="Redo."
      title="Redo last action."
      disabled={redoCount === 0}
      on:click={() => {
        undoManager.redo();
        syncDocumentToServer($liveView);
      }}
    >
      <Redo2 className="w-6 h-6" />
    </button>
  </div>
</div>
