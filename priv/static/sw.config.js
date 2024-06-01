export default {
  cacheName: "v2024.05.31.1",
  debug: false,
  disableCache: false, // Set to true during dev to disable caching.
  messageTypes: {
    REQUEST_ASSET_CACHING: "request_asset_caching",
    REQUEST_ASSET_DELETION: "request_asset_deletion",
    REQUEST_SKIP_WAITING: "request_skip_waiting",
    REQUEST_SERVICE_WORKER_VERSION: "request_service_worker_version",
  },
  privateAssets: [
    "/app", 
  ],
  publicAssets: [
    "/favicon.ico",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/apple-touch-icon.png",
    "/browserconfig.xml",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/mstile-150x150.png",
    "/og.png",
    "/safari-pinned-tab.svg",
    "/screenshot-narrow-light.png",
    "/screenshot-narrow-dark.png",
    "/screenshot-wide-light.png",
    "/screenshot-wide-dark.png",
    "/site.webmanifest",

    // Note: This route should only be cached after login so that
    // DataClearer does not run.
    "/offline", 
  ]
}