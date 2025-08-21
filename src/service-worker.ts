// Simple service worker for caching critical assets
// Ensure self is properly typed
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'leelaos-cache-v1';
const URLS_TO_CACHE = ['/'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      });
    })
  );
});

// Listen for messages from the client to cache additional resources
self.addEventListener('message', (event: ExtendableEvent & { data?: any }) => {
  const { data } = event;
  if (data && data.type === 'CACHE_URLS' && Array.isArray(data.payload)) {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(data.payload))
    );
  }
});

// Handle incoming push messages and display notifications
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;
  const data = event.data.json();
  const title = data.title || 'Notification';
  const options: NotificationOptions = {
    body: data.body,
    icon: data.icon,
    data: data.url ? { url: data.url } : undefined,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Open the notification's URL when clicked
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const url = event.notification.data?.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
