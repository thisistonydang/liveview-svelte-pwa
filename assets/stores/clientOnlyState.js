import { writable } from "svelte/store";

export const isListsOpened = writable(true);
export const isTodoOpened = writable(true);
export const moveTodoId = writable("");
export const newList = writable("");
export const newTodo = writable("");
export const openedMenuId = writable("");
export const selectedListId = writable("");
export const urlHash = writable(""); // "" | "about" | "listId"
