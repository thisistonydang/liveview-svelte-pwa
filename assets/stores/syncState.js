import { writable } from "svelte/store";

export const syncState = writable(); // Not Synced | Syncing | Synced
