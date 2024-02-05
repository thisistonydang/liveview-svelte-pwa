import { writable } from "svelte/store";

// Store containing 'live' object from live_svelte.
export let liveView = writable();

// Socket assigns from LiveView
export let serverDocument = writable<string>();
export let sessionCount = writable<number>();
