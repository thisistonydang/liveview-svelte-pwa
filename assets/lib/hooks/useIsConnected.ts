/**
 * Check if the client can connect to the origin server.
 *
 * @param options.pathname - URL path to try to send fetch request. Default: "/"
 * @param options.timeout - Default: 5000 milliseconds
 */
export async function isConnected({
  pathname = "/",
  timeout = 5000,
}: {
  pathname?: string;
  timeout?: number;
}): Promise<boolean> {
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
