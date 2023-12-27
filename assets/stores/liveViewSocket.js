import { writable } from "svelte/store";

// Boolean store to track when the socket is initially mounted.
export let isSocketMounted = writable(false);

// Store containing 'live' object from live_svelte.
export let liveView = writable();

// Socket assigns from LiveView
export let serverState = writable();
export let sessionCount = writable();
