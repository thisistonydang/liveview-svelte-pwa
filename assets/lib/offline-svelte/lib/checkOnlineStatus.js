import { connectionStatus } from "./connectionStatus";

/**
 * Check if the client is online and set isOnline store.
 */
export async function checkOnlineStatus() {
  if (!window.navigator.onLine) {
    connectionStatus.set("Disconnected");
  }

  try {
    const url = new URL(window.location.origin); // Avoid CORS errors with request to your own origin.
    url.searchParams.set("rand", Date.now().toString()); // Prevents cached responses.
    const response = await fetch(url, { method: "HEAD" }); // HEAD request to avoid interception by service worker.
    // TODO: Add timeout.
    // signal: AbortSignal.timeout(500),

    connectionStatus.set(response.ok ? "Connected" : "Disconnected");
  } catch {
    connectionStatus.set("Disconnected");
  }
}
