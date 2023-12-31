import { writable } from "svelte/store";

export const currentTheme = writable("system"); // "system" | "light" | "dark"
