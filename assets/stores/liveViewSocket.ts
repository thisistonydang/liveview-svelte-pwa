import { writable } from "svelte/store";

import type { Live } from "live_svelte";

// Store containing 'live' object from live_svelte.
export let liveView = writable<Live>();

// Socket assigns from LiveView
export let serverDocument = writable<{ event: string; document: string | null }>();
export let sessionCount = writable<number>();
