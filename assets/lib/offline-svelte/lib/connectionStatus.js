import { writable } from "svelte/store";

export const connectionStatus = writable("Connected"); // "Connected" | "Checking" | "Disconnected"
