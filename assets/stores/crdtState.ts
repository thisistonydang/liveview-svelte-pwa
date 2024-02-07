import { writable } from "svelte/store";

import type { Array as YArray, Map as YMap } from "yjs";

export interface TodoList {
  id: string;
  name: string;
  newName?: string;
  isEditing?: boolean;
}

export interface TodoItem {
  id: string;
  name: string;
  completed: boolean;
  listId: string;
  newName?: string;
  isEditing?: boolean;
}

export function isTodoItem(item: TodoList | TodoItem): item is TodoItem {
  return "listId" in item && typeof item.listId === "string";
}

export const todoLists = writable<TodoList[]>();
export const todoItems = writable<TodoItem[]>();

export const yTodoLists = writable<YArray<YMap<string | boolean>>>();
export const yTodoItems = writable<YArray<YMap<string | boolean>>>();
