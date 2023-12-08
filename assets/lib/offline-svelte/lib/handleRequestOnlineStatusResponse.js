import { get } from "svelte/store";

import { isOnline } from "./isOnline";
import { isSvelteMounted } from "./isSvelteMounted";

/**
 * Handle "request_online_status" response from service worker.
 *
 * @param {{
 *   event: MessageEvent,
 *   liveViewPath: string,
 *   deadViewPath: string,
 * }} options
 */
export function handleRequestOnlineStatusResponse({ event, liveViewPath, deadViewPath }) {
  const currentPath = window.location.pathname;
  const svelteMounted = isSvelteMounted();
  isOnline.set(event.data.payload.isOnline);

  if (currentPath === liveViewPath && !get(isOnline) && !svelteMounted) {
    window.location.replace(deadViewPath);
  } else if (currentPath === deadViewPath && get(isOnline)) {
    window.location.replace(liveViewPath);
  }
}
