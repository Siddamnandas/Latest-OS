// Service Worker for Leela OS
// Handles caching, offline support, and push notifications

const CACHE_NAME = 'leelaos-v1';
const OFFLINE_CACHE = 'leelaos-offline-v1';
const RUNTIME_CACHE = 'leelaos-runtime-v1';

// URLs to cache during installation
const urlsToCache = [
  '/',
  '/manifest.json',
];

// Install event
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources cached');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return undefined;
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event with cache-first strategy
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response for caching
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Store failed request for retry when online
              return storeOfflineRequest(request)
                .then(() => {
                  return new Response('Offline - request will be retried when online', {
                    status: 202,
                    statusText: 'Accepted (Offline)'
                  });
                });
            });
        })
    );
    return;
  }

  // Handle all other requests with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response for caching
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
            return response;
          });
      })
  );
});

// Store offline requests for retry when online
async function storeOfflineRequest(request: Request): Promise<void> {
  const db = await openOfflineDB();
  const tx = db.transaction(['requests'], 'readwrite');
  const store = tx.objectStore('requests');
  
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: request.method === 'POST' || request.method === 'PUT' ? await request.text() : null,
    timestamp: Date.now()
  };
  
  store.add(requestData);
  
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Open IndexedDB for offline request storage
function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('leelaos-offline', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('requests')) {
        const store = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Retry offline requests when back online
async function retryOfflineRequests(): Promise<void> {
  const db = await openOfflineDB();
  const tx = db.transaction(['requests'], 'readwrite');
  const store = tx.objectStore('requests');
  const getAllRequest = store.getAll();
  const getKeysRequest = store.getAllKeys();
  
  const [requests, requestKeys] = await Promise.all([
    new Promise<any[]>((resolve, reject) => {
      getAllRequest.onsuccess = () => resolve(getAllRequest.result as any[]);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    }),
    new Promise<any[]>((resolve, reject) => {
      getKeysRequest.onsuccess = () => resolve(getKeysRequest.result as any[]);
      getKeysRequest.onerror = () => reject(getKeysRequest.error);
    })
  ]);

  for (let i = 0; i < requests.length; i++) {
    const req = requests[i];
    const key = requestKeys[i];
    try {
      await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
      store.delete(key);
    } catch (err) {
      console.error('Failed to retry offline request:', err);
      // Leave the request in the queue if it fails
    }
  }
  
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Push notification handlers
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Leela OS Notification';
  const options: NotificationOptions = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    data: data.data,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const target = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return (client as WindowClient).focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(target);
      }
      return undefined;
    })
  );
});

// Listen for online event to retry offline requests
self.addEventListener('online', () => {
  console.log('Network back online, retrying offline requests...');
  retryOfflineRequests().catch(console.error);
});