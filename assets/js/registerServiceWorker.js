async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("[Service Worker] Registered.", registration);
  } catch (error) {
    console.error("[Service Worker] Registration Failed.", error);
  }
}

function main() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", registerServiceWorker);
  } else {
    console.error("[Service Worker] Not Supported.");
  }
}

main();
