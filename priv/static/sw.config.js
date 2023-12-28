export default {
  cacheName: "2023-12-20v38",
  debug: false,
  serveFromCacheFirst: true,
  privateAssets: [
    "/app", 

    // /offline is a public route but should only be cached after login so that
    // DataClearer does not run while offline.
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
    "/site.webmanifest",
  ]
}