import { writable } from "svelte/store";

export const todoItems = writable([]);
export const completedItems = writable([]);
