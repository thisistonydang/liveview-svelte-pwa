import topbar from "../../vendor/topbar";
import { LOADING_START_EVENT, LOADING_STOP_EVENT } from "./lib/events";

/**
 * Configure topbar and listen for loading events to show/hide topbar.
 */
export function initTopBar() {
  // Configure topbar.
  topbar.config({ barColors: { 0: "#00c7b5" }, shadowColor: "rgba(0, 0, 0, .3)" });

  // Listen for page loading events.
  window.addEventListener(LOADING_START_EVENT, (_e) => topbar.show(300));
  window.addEventListener(LOADING_STOP_EVENT, (_e) => topbar.hide());
}
