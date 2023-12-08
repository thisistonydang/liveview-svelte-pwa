import { get } from "svelte/store";

import { isOnline } from "./isOnline";
import { isSvelteMounted } from "./isSvelteMounted";
import { rememberScrollPosition } from "./rememberScrollPosition";

/**
 * Handle "request_online_status" response from service worker.
 *
 * @param {{
 *   event: MessageEvent,
 *   liveViewPath: string,
 *   deadViewPath: string,
 *   scrollPositionKey: string,
 * }} options
 */
export function handleRequestOnlineStatusResponse({
  event,
  liveViewPath,
  deadViewPath,
  scrollPositionKey,
}) {
  const currentPath = window.location.pathname;
  const svelteMounted = isSvelteMounted();
  isOnline.set(event.data.payload.isOnline);

  if (currentPath === liveViewPath && !get(isOnline) && !svelteMounted) {
    rememberScrollPosition(scrollPositionKey);
    window.location.replace(deadViewPath);
  } else if (currentPath === deadViewPath && get(isOnline)) {
    rememberScrollPosition(scrollPositionKey);
    window.location.replace(liveViewPath);
  }
}
