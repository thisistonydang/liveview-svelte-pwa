/**
 * Check if the client can connect to the origin server.
 *
 * @param options.pathname - URL path to try to send fetch request. Default: "/"
 * @param options.timeout - Default: 5000 milliseconds
 */
export async function useIsConnected({
  pathname = "/",
  timeout = 5000,
}: {
  pathname?: string;
  timeout?: number;
}): Promise<boolean> {
  try {
    // Avoid CORS errors with request to own origin.
    const url = new URL(`${window.location.origin}${pathname}`);

    // Note: Timestamp is to prevent cached responses.
    url.searchParams.set("bypass_service_worker", Date.now().toString());

    const response = await fetch(url, {
      // Timeout to prevent excessive wait time.
      signal: AbortSignal.timeout(timeout),
    });

    return response.ok;
  } catch {
    return false;
  }
}
