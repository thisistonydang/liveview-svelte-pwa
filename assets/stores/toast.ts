import { writable } from "svelte/store";

export const toast = writable({
  show: false,
  kind: "", // info | error
  title: "",
  msg: "",
});
