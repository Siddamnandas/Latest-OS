// Service Worker for Latest-OS PWA
const CACHE_NAME = 'latest-os-v1';
const API_CACHE_NAME = 'latest-os-api-v1';
const IMAGE_CACHE_NAME = 'latest-os-images-v1';

// Resources to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/animations.css',
  '/globals.css',
  '/offline.html',
];

// API routes that benefit from caching
const API_CACHE_URLS = [
  '/api/couple/live-data',
  '/api/memories',
  '/api/kids/activities',
];

// Runtime cache for images and uploaded content
const IMAGE_CACHE_URLS = [
  /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
];

self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      }),

      // Skip cache installation - let API calls be live
      // This ensures fresh data for relationship content
    ])
  );

  // Force activation immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME &&
                cacheName !== API_CACHE_NAME &&
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Take control of all pages immediately
      clients.claim(),
    ])
  );
});

// Network-first strategy for API calls (relationships data should be fresh)
async function fetchAndCacheAPI(request) {
  try {
    const response = await fetch(request);

    // Cache successful responses for a short time
    if (response.status === 200) {
      const cache = await caches.open(API_CACHE_NAME);
      // Add a cache-control header to expire in 5 minutes
      const responseClone = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'sw-cache-timestamp': Date.now().toString(),
        },
      });
      cache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    console.log('[SW] Network fetch failed for API:', request.url);
    // Try to return cached version
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch('/api/offline-response');
  }
}

// Cache-first strategy for static resources
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Fetch failed for static resource:', request.url);
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    return new Response('', { status: 404 });
  }
}

// Stale-while-revalidate for images
async function staleWhileRevalidate(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    // Cache the fresh response
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API calls - Network first with fallback to cache
    if (API_CACHE_URLS.some(apiPath => url.pathname.startsWith(apiPath))) {
      event.respondWith(fetchAndCacheAPI(request));
    } else {
      // Regular API calls without special caching
      event.respondWith(fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline', message: 'You are offline. Please check your connection.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }));
    }
  } else if (request.destination === 'image' ||
             request.destination === 'font' ||
             IMAGE_CACHE_URLS.some(pattern => pattern.test(url.pathname))) {
    // Images and assets - Stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else if (STATIC_CACHE_URLS.includes(url.pathname) ||
             request.destination === 'style' ||
             request.destination === 'script' ||
             request.destination === 'document') {
    // Static resources - Cache first
    event.respondWith(cacheFirst(request));
  } else {
    // Other requests pass through normally
    event.respondWith(fetch(request));
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/action-view.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Latest-OS', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'dismiss') {
    return;
  }

  // Try to focus existing window, otherwise open new tab
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      const url = data?.url || '/';

      // Check if there's already a tab open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new tab if none exists
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );

  // Notify the app about the notification click
  if (clients.openWindow) {
    clients.openWindow('/api/notification-click?action=' + action + '&data=' + encodeURIComponent(JSON.stringify(data)));
  }
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'relationship-sync') {
    event.waitUntil(syncRelationshipData());
  }

  if (event.tag === 'upload-memory') {
    event.waitUntil(uploadPendingMemories());
  }
});

// Background sync functions
async function syncRelationshipData() {
  try {
    // Sync pending relationship data
    await fetch('/api/sync/relationship-data');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

async function uploadPendingMemories() {
  try {
    // Upload any pending memory files
    await fetch('/api/sync/pending-memories');
  } catch (error) {
    console.error('[SW] Memory upload sync failed:', error);
  }
}

// Handle periodic background sync for relationship reminders
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'relationship-reminder') {
    event.waitUntil(sendRelationshipReminder());
  }
});

async function sendRelationshipReminder() {
  try {
    const reminders = await getStoredReminders();

    for (const reminder of reminders) {
      if (shouldSendReminder(reminder)) {
        self.registration.showNotification(
          'Relationship Reminder',
          {
            body: reminder.message,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge.png',
            tag: 'relationship-reminder',
            requireInteraction: true,
          }
        );
      }
    }
  } catch (error) {
    console.log('[SW] Reminder sync failed:', error);
  }
}

// Helper functions for reminders
async function getStoredReminders() {
  // This would typically get reminders from IndexedDB or cache
  return [
    {
      id: 'daily-sync',
      message: 'Time for your daily relationship sync! 💑',
      schedule: 'daily',
    },
  ];
}

function shouldSendReminder(reminder) {
  // Simple time-based logic for reminders
  const now = new Date();
  const hour = now.getHours();

  if (reminder.schedule === 'daily' && hour === 20) { // 8 PM
    return true;
  }

  return false;
}

// Handle message from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
