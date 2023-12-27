import { writable } from "svelte/store";

// Boolean store to track when the socket is initially mounted.
export let isSocketMounted = writable(false);

// Store containing 'live' object from live_svelte.
export let liveView = writable();

// Socket Assigns from LiveView ____________________________________________________________________

// Initial default state is required so that syncServerToClient can run when
// offline. This is necessary because syncServerToClient is what sets the
// initial states for the $todoItems, $completedItems, and $syncState stores.
export let serverState = writable({
  meta: { synced: true },
  timestamp: 0,
  value: { todo: [], completed: [] },
});

// Count of active sessions a user has.
export let sessionCount = writable();
