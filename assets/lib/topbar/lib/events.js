export const LOADING_START_EVENT = "phx:page-loading-start";
export const LOADING_STOP_EVENT = "phx:page-loading-stop";

export function showTopBar() {
  window.dispatchEvent(new CustomEvent(LOADING_START_EVENT));
}

export function hideTopBar() {
  window.dispatchEvent(new CustomEvent(LOADING_STOP_EVENT));
}
