// Simple service worker for caching critical assets
// Ensure self is properly typed
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'leelaos-cache-v1';
const URLS_TO_CACHE = ['/'];
const SYNC_TAG = 'leelaos-sync';
const QUEUE_DB = 'leelaos-request-queue';
const QUEUE_STORE = 'requests';

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
  const { request } = event;
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, responseClone));
          return response;
        });
      })
    );
    return;
  }

  if (request.method !== 'GET') {
    event.respondWith(
      fetch(request.clone()).catch(() => queueRequest(request))
    );
  }
});

self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(flushQueue());
  }
});

function openQueue(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(QUEUE_DB, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(QUEUE_STORE, { autoIncrement: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function queueRequest(request: Request) {
  const db = await openQueue();
  const tx = db.transaction(QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(QUEUE_STORE);
  const body = await request.clone().text();
  store.add({
    url: request.url,
    method: request.method,
    headers: Array.from(request.headers.entries()),
    body,
  });
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  await self.registration.sync.register(SYNC_TAG);
  return new Response(JSON.stringify({ queued: true }), { status: 202 });
}

async function flushQueue() {
  const db = await openQueue();
  const tx = db.transaction(QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(QUEUE_STORE);
  const all = store.getAll();
  const keys = store.getAllKeys();
  const [requests, requestKeys] = await Promise.all([
    new Promise<any[]>((resolve, reject) => {
      all.onsuccess = () => resolve(all.result as any[]);
      all.onerror = () => reject(all.error);
    }),
    new Promise<any[]>((resolve, reject) => {
      keys.onsuccess = () => resolve(keys.result as any[]);
      keys.onerror = () => reject(keys.error);
    }),
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
      // Leave the request in the queue if it fails
    }
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
