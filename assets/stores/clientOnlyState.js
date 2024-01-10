import { writable } from "svelte/store";

export const activeTab = writable("To-Do"); // "To-Do" | "Lists"
export const isAccountMenuOpened = writable(false);
export const isListsOpened = writable(true);
export const isTodoOpened = writable(true);
export const newList = writable("");
export const newTodo = writable("");
export const openedOptionsMenuId = writable("");
