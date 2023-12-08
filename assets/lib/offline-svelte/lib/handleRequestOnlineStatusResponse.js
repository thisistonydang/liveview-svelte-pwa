import { get } from "svelte/store";

import { isOnline } from "./isOnline";
import { isSvelteMounted } from "./isSvelteMounted";

/**
 * Handle "request_online_status" response from service worker.
 *
 * @param {{
 *   event: MessageEvent,
 *   liveViewPath: string,
 *   fallbackPath: string,
 * }} options
 */
export function handleRequestOnlineStatusResponse({ event, liveViewPath, fallbackPath }) {
  const currentPath = window.location.pathname;
  const svelteMounted = isSvelteMounted();
  isOnline.set(event.data.payload.isOnline);

  if (currentPath === liveViewPath && !get(isOnline) && !svelteMounted) {
    window.location.replace(fallbackPath);
  } else if (currentPath === fallbackPath && get(isOnline)) {
    window.location.replace(liveViewPath);
  }
}
