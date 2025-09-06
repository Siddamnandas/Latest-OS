/// <reference lib="webworker" />
// Service Worker for Latest-OS
// Handles caching, offline support, and push notifications
export {};
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'latest-os-v2';
const OFFLINE_CACHE = 'latest-os-offline-v2';
const RUNTIME_CACHE = 'latest-os-runtime-v2';
const CRITICAL_CACHE = 'latest-os-critical-v2';

// Critical URLs to cache during installation
const criticalUrlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Core app pages for offline access
  '/tasks',
  '/sync',
  '/memories',
  '/offline', // Offline fallback page
];

// API endpoints to cache for offline functionality
const criticalApiEndpoints = [
  '/api/couple/live-data',
  '/api/tasks',
  '/api/sync/complete',
  '/api/auth/me',
];

// Static assets patterns for aggressive caching
const staticAssetPatterns = [
  /\.(js|css|woff|woff2|ttf|eot)$/,
  /\/(icons|images)\//,
  /\/favicon\./,
];

// Network timeout for API requests
const NETWORK_TIMEOUT = 5000;

// Install event - Cache critical resources
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    Promise.all([
      // Cache critical static resources
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Caching critical static resources');
        return cache.addAll(criticalUrlsToCache);
      }),
      
      // Pre-cache critical API data for offline access
      caches.open(CRITICAL_CACHE).then(async (cache) => {
        console.log('🗄️ Pre-caching critical API data');
        try {
          // Cache essential API responses
          for (const endpoint of criticalApiEndpoints) {
            try {
              const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' }
              });
              if (response.ok) {
                await cache.put(endpoint, response.clone());
                console.log(`✅ Cached API: ${endpoint}`);
              }
            } catch (apiError) {
              console.log(`⚠️ Failed to pre-cache API: ${endpoint}`);
            }
          }
        } catch (error) {
          console.log('⚠️ Some API pre-caching failed, continuing...');
        }
      })
    ]).then(() => {
      console.log('✅ All critical resources cached');
      return self.skipWaiting();
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        const validCaches = [CACHE_NAME, OFFLINE_CACHE, RUNTIME_CACHE, CRITICAL_CACHE];
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return undefined;
          })
        );
      }),
      
      // Update critical API cache on activation
      updateCriticalApiCache()
    ]).then(() => {
      console.log('✅ Service Worker activated and ready');
      return self.clients.claim();
    })
  );
});

// Helper function to update critical API cache
async function updateCriticalApiCache() {
  try {
    const cache = await caches.open(CRITICAL_CACHE);
    console.log('🔄 Updating critical API cache...');
    
    for (const endpoint of criticalApiEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (response.ok) {
          await cache.put(endpoint, response.clone());
        }
      } catch (error) {
        console.log(`⚠️ Failed to update cache for: ${endpoint}`);
      }
    }
  } catch (error) {
    console.log('⚠️ Critical API cache update failed');
  }
}

// Fetch event with advanced caching strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests for most caching strategies
  if (request.method !== 'GET' && !url.pathname.startsWith('/api/')) {
    return;
  }

  // Skip chrome-extension and other protocols
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Handle API requests with network-first + offline queue strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (staticAssetPatterns.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests with network-first + offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: try cache first, then network
  event.respondWith(handleDefault(request));
});

// Handle API requests with intelligent caching and offline queue
async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request.clone()),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      )
    ]) as Response;

    // If successful, cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      // Only cache GET requests
      if (request.method === 'GET') {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (networkError) {
    console.log(`😳 Network failed for ${url.pathname}, trying cache...`);
    
    // For GET requests, try cache
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log(`📋 Serving ${url.pathname} from cache`);
        return cachedResponse;
      }
      
      // Check critical cache for essential APIs
      const criticalCache = await caches.open(CRITICAL_CACHE);
      const criticalResponse = await criticalCache.match(request);
      if (criticalResponse) {
        console.log(`🔴 Serving ${url.pathname} from critical cache`);
        return criticalResponse;
      }
    }
    
    // For POST/PUT requests or when no cache available, queue for retry
    if (request.method !== 'GET') {
      await storeOfflineRequest(request);
      return new Response(
        JSON.stringify({
          offline: true,
          message: 'Request queued for when online',
          timestamp: Date.now()
        }),
        {
          status: 202,
          statusText: 'Accepted (Offline)',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return generic offline response for GET requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Unable to fetch data while offline',
        timestamp: Date.now()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with aggressive caching
async function handleStaticAsset(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return a generic fallback for failed static assets
    return new Response('Asset unavailable offline', { status: 404 });
  }
}

// Handle navigation requests with offline fallback
async function handleNavigation(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline fallback page
    const offlineResponse = await caches.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Last resort: basic offline page
    return new Response(
      `<!DOCTYPE html>
      <html><head><title>Offline - Latest-OS</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>body{font-family:sans-serif;text-align:center;padding:2rem;background:#0a0a0a;color:#fff}h1{color:#8b5cf6}</style>
      </head><body>
      <h1>😳 You're Offline</h1>
      <p>Latest-OS needs an internet connection for this page.</p>
      <p>Please check your connection and try again.</p>
      <button onclick="location.reload()" style="background:#8b5cf6;color:white;border:none;padding:1rem 2rem;border-radius:0.5rem;font-size:1rem;cursor:pointer;margin-top:1rem">Try Again</button>
      </body></html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Default handler for other requests
async function handleDefault(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Content unavailable offline', { status: 404 });
  }
}

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
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList: readonly Client[]) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return (client as WindowClient).focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(target);
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
