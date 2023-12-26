import { writable } from "svelte/store";

// Store containing all exported LiveView methods available to the frontend.
export let liveView = writable();
