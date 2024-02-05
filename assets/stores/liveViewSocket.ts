import { writable } from "svelte/store";

// Store containing 'live' object from live_svelte.
export let liveView = writable();

// Socket assigns from LiveView
export let serverDocument = writable<{ event: string; document: string | null }>();
export let sessionCount = writable<number>();
