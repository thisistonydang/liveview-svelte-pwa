import { writable } from "svelte/store";

export const isAccountMenuOpened = writable(false);
export const isTodoOpened = writable(true);
export const isCompletedOpened = writable(false);
export const newTodo = writable("");
export const openedOptionsMenuId = writable("");
