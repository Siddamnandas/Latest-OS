// Simple service worker for caching critical assets
const CACHE_NAME = "leela-os-cache-v1";
const ASSETS_TO_CACHE = ["/", "/logo.svg", "/manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then(response => {
        const responseClone = response.clone();
        caches
          .open(CACHE_NAME)
          .then(cache => cache.put(event.request, responseClone));
        return response;
      });
    })
  );
});
