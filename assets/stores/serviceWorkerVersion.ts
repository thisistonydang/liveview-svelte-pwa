import { writable } from "svelte/store";

export const serviceWorkerVersion = writable<string>("");
