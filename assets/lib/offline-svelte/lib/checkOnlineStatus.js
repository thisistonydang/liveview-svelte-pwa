import { connectionStatus } from "./connectionStatus";

/**
 * Check if the client is online and set connectionStatus store.
 *
 * @param {Object} options
 * @param {number} options.timeout - Default: 500
 */
export async function checkOnlineStatus({ timeout } = { timeout: 500 }) {
  if (!window.navigator.onLine) {
    connectionStatus.set("Disconnected");
  }

  try {
    const url = new URL(window.location.origin); // Avoid CORS errors with request to your own origin.
    url.searchParams.set("rand", Date.now().toString()); // Prevents cached responses.
    const response = await fetch(url, {
      method: "HEAD", // HEAD request to avoid interception by service worker.
      signal: AbortSignal.timeout(timeout), // Timeout to prevent excessive wait time.
    });

    connectionStatus.set(response.ok ? "Connected" : "Disconnected");
  } catch {
    connectionStatus.set("Disconnected");
  }
}
