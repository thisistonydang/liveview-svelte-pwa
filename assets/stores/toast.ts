import { writable } from "svelte/store";

export const toast = writable<{
  show: boolean;
  kind: "info" | "error";
  title: string;
  msg: string;
}>({
  show: false,
  kind: "info",
  title: "",
  msg: "",
});
