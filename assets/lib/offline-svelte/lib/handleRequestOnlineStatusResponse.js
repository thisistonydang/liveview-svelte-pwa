import { get } from "svelte/store";

import { isSvelteMounted } from "./isSvelteMounted";
import { connectionStatus } from "./connectionStatus";
import { pollIntervalId } from "./pollIntervalId";

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
  connectionStatus.set(event.data.payload.isOnline ? "Connected" : "Disconnected");

  if (currentPath === liveViewPath && get(connectionStatus) === "Disconnected" && !svelteMounted) {
    window.location.replace(fallbackPath);
  } else if (
    currentPath !== liveViewPath &&
    get(connectionStatus) === "Connected" &&
    svelteMounted
  ) {
    // Clear polling interval.
    const intervalId = get(pollIntervalId);
    if (intervalId) {
      clearInterval(intervalId);
    }

    window.location.replace(liveViewPath);
  }
}
