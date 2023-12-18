import { isOnline } from "./isOnline";

/**
 * Check if the client is online and set isOnline store.
 */
export async function checkOnlineStatus() {
  if (!window.navigator.onLine) {
    isOnline.set(false);
  }

  try {
    const url = new URL(window.location.origin); // Avoid CORS errors with request to your own origin.
    url.searchParams.set("rand", Date.now().toString()); // Prevents cached responses.
    const response = await fetch(url, { method: "HEAD" }); // HEAD request to avoid interception by service worker.

    isOnline.set(response.ok);
  } catch {
    isOnline.set(false);
  }
}
