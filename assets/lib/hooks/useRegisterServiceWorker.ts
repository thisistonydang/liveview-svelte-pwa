const DEBUG = false;

export function useRegisterServiceWorker(serviceWorkerPath: string) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register(serviceWorkerPath, {
          type: "module", // Allow ES module imports in sw.
          updateViaCache: "none", // Always update sw imports from network to prevent caching issues.
        });
        DEBUG && console.log("[Service Worker] Registered.", registration);
      } catch (error) {
        console.error("[Service Worker] Registration Failed.", error);
      }
    });
  } else {
    console.error("[Service Worker] Not Supported.");
  }
}
