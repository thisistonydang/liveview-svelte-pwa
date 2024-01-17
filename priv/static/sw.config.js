export default {
  cacheName: "v2024.01.14.1",
  debug: false,
  privateAssets: [
    "/app", 
  ],
  publicAssets: [
    "/assets/app.css",
    "/assets/app.js",
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