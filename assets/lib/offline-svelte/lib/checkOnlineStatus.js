/**
 * Check if the client is online.
 */
async function isOnline() {
  if (!self.navigator.onLine) {
    return false;
  }

  try {
    const url = new URL(self.location.origin); // Avoid CORS errors with request to your own origin.
    url.searchParams.set("rand", Date.now().toString()); // Prevents cached responses.
    const response = await fetch(url, { method: "HEAD" });

    return response.ok;
  } catch {
    return false;
  }
}
