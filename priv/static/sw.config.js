export default {
  cacheName: "v2024.01.01.3",
  debug: false,
  privateAssets: [
    "/app", 

    // These are public routes but should only be cached after login so that
    // DataClearer does not run while offline.
    "/about",
    "/offline", 
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
    "/safari-pinned-tab.svg",
    "/screenshot-narrow-light.png",
    "/screenshot-narrow-dark.png",
    "/screenshot-wide-light.png",
    "/screenshot-wide-dark.png",
    "/site.webmanifest",
  ]
}