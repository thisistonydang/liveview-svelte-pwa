// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";

// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import { LiveSocket } from "phoenix_live_view";

// Live Svelte integration.
import { getHooks } from "live_svelte";
// @ts-expect-error; loading all Svelte components for live_svelte.
import * as Components from "../svelte/**/*.svelte";

import { useRegisterServiceWorker } from "$lib/hooks/useRegisterServiceWorker";
import { initTopBar } from "$lib/topbar/initTopBar";

interface LiveViewSocket extends LiveSocket {
  isConnected: () => boolean;
}

declare global {
  interface Window {
    liveSocket: LiveViewSocket;
  }
}

useRegisterServiceWorker("/sw.js");
initTopBar();

let csrfToken = document.querySelector("meta[name='csrf-token']")?.getAttribute("content");
let liveSocket = new LiveSocket("/live", Socket, {
  hooks: getHooks(Components),
  params: { _csrf_token: csrfToken },
}) as LiveViewSocket;

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;

// When the websocket connects, check if the user should be redirected (i.e. due
// to being logged out). This is necessary because the service worker will
// always serve from the cache so the standard Phoenix redirect will not occur.
liveSocket.getSocket().onOpen(async () => {
  try {
    // Use HEAD request to bypass service worker.
    const response = await fetch(window.location.href, { method: "HEAD" });
    if (response.redirected) {
      window.location.replace(response.url);
    }
  } catch (error) {
    console.error("Error while checking for redirection on LiveView socket connection.", error);
  }
});

// Check for when the page becomes visible and refresh to reconnect the socket
// if it has been disconnected. This is mainly for the case where a user
// switches away from the app window and returns after an extended period where
// the socket may have been disconnected.
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !liveSocket.isConnected()) {
    window.location.reload();
  }
});
