import { writable } from "svelte/store";

export const toastMessage = writable({
  show: false,
  kind: "", // info | error
  title: "",
  msg: "",
});
