import { writable } from "svelte/store";

// TODO: Import type instead of defining it here if possible.
export interface Live {
  pushEvent: (event: string, payload?: { [key: string]: string }) => void;
}

// Store containing 'live' object from live_svelte.
export let liveView = writable<Live>();

// Socket assigns from LiveView
export let serverDocument = writable<{ event: string; document: string | null }>();
export let sessionCount = writable<number>();
