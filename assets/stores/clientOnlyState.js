import { writable } from "svelte/store";

export const isListsOpened = writable(true);
export const isTodoOpened = writable(true);
export const itemToProcessId = writable("");
export const newList = writable("");
export const newTodo = writable("");
export const openedMenuId = writable("");
export const selectedListId = writable("");

/** @type {import("svelte/store").Writable<"" | "about" | "listId">} */
export const urlHash = writable("");
