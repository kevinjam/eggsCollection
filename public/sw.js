// public/sw.js
const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = [
  "/",                              // Root page
  "/manifest.json",                 // Manifest
  "/icon-192x192.png",              // Icons
  "/icon-512x512.png",
  "/_next/static/chunks/main-5b1bff77d3c6d17b.js",   // Main JS chunk
  "/_next/static/chunks/webpack-159b0549cc55d90e.js", // Webpack runtime
  "/_next/static/chunks/pages/index.js", // Pages Router index (if used)
  "/_next/static/css/af6b0c4c2bc57d0a.css", // CSS (replace with actual hash)
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching resources:", urlsToCache);
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("Cache failed:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Serve from cache if available
      }
      return fetch(event.request).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/"); // Serve cached root page
        }
        return new Response("Offline and no resource cached", {
          status: 503,
          statusText: "Service Unavailable",
        });
      });
    })
  );
});