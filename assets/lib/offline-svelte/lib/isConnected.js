/**
 * Check if the client can connect to the origin server.
 *
 * @param {Object} options
 * @param {string} options.pathname - URL path to try to send fetch request. Default: "/"
 * @param {number} options.timeout - Default: 2000 milliseconds
 *
 * @returns {Promise<boolean>}
 */
export async function isConnected({ pathname, timeout } = { pathname: "/", timeout: 2000 }) {
  if (!window.navigator.onLine) {
    return false;
  }

  try {
    // Avoid CORS errors with request to own origin.
    const url = new URL(`${window.location.origin}${pathname}`);

    // Add random query parameter to prevent cached responses.
    url.searchParams.set("rand", Date.now().toString());

    const response = await fetch(url, {
      method: "HEAD", // HEAD request to speed up response and avoid interception by service worker.
      signal: AbortSignal.timeout(timeout), // Timeout to prevent excessive wait time.
    });

    return response.ok;
  } catch {
    return false;
  }
}
