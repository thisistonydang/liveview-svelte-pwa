import { writable } from "svelte/store";

export const currentTheme = writable<"system" | "light" | "dark">("system");
