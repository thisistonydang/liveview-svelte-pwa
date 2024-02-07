import { writable } from "svelte/store";

import type { Live } from "live_svelte";

export interface ServerDocument {
  event: string;
  document: string | null;
}

// Store containing 'live' object from live_svelte.
export let liveView = writable<Live>();

// Socket assigns from LiveView
export let serverDocument = writable<ServerDocument>();
export let sessionCount = writable<number>();
