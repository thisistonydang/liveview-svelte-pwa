import { writable } from "svelte/store";

export const todoLists = writable([]);
export const todoItems = writable([]);

export const yTodoLists = writable();
export const yTodoItems = writable();
