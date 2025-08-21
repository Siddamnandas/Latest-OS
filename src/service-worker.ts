42   caches
43            .open(CACHE_NAME)
44            .then((cache) => cache.put(request, responseClone));
45   return response;
46        });
47      })
48    );
49   return;
50  }
51  
52   if (request.method !== 'GET') {
53   event.respondWith(
54   fetch(request.clone()).catch(() => queueRequest(request))
55    );
56  }
57});
58  
59self.addEventListener('sync', (event: SyncEvent) => {
60   if (event.tag === SYNC_TAG) {
61   event.waitUntil(flushQueue());
62  }
63});
64  
65// Listen for messages from the client to cache additional resources
66self.addEventListener('message', (event: ExtendableEvent & { data?: any }) => {
67   const { data } = event;
68   if (data && data.type === 'CACHE_URLS' && Array.isArray(data.payload)) {
69   event.waitUntil(
70   caches.open(CACHE_NAME).then((cache) => cache.addAll(data.payload))
71   );
72   }
73});
74  
75// Handle incoming push messages and display notifications
76self.addEventListener('push', (event: PushEvent) => {
77   if (!event.data) return;
78   const data = event.data.json();
79   const title = data.title || 'Notification';
80   const options: NotificationOptions = {
81   body: data.body,
82   icon: data.icon,
83   data: data.url ? { url: data.url } : undefined,
84   };
85   event.waitUntil(self.registration.showNotification(title, options));
86});
87  
88// Open the notification's URL when clicked
89self.addEventListener('notificationclick', (event: NotificationEvent) => {
90   event.notification.close();
91   const url = event.notification.data?.url;
92   if (url) {
93   event.waitUntil(clients.openWindow(url));
94   }
95});
96  
97function openQueue(): Promise<IDBDatabase> {
98   return new Promise((resolve, reject) => {
99   const request = indexedDB.open(QUEUE_DB, 1);
100   request.onupgradeneeded = () => {
101   request.result.createObjectStore(QUEUE_STORE, { autoIncrement: true });
102   };
103   request.onsuccess = () => resolve(request.result);
104   request.onerror = () => reject(request.error);
105   });
106}