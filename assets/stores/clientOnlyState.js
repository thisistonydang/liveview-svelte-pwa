import { writable } from "svelte/store";

export const activeTab = writable("To-Do"); // "To-Do" | "Lists"
export const currentTheme = writable("system"); // "system" | "light" | "dark"
export const isListsOpened = writable(true);
export const isTodoOpened = writable(true);
export const newList = writable("");
export const newTodo = writable("");
export const openedMenuId = writable("");
export const selectedListId = writable("");
