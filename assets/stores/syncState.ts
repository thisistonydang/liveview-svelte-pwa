import { writable } from "svelte/store";

export const syncState = writable<"Not Synced" | "Syncing" | "Synced">("Not Synced");

window.addEventListener("phx-disconnected", () => {
  syncState.set("Not Synced");
});
