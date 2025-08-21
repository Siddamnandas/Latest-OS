125   all.onerror = () => reject(all.error);
126   }),
127   new Promise<any[]>((resolve, reject) => {
128     keys.onsuccess = () => resolve(keys.result as any[]);
129     keys.onerror = () => reject(keys.error);
130   }),
131   ]);
132 ​
133   for (let i = 0; i < requests.length; i++) {
134     const req = requests[i];
135     const key = requestKeys[i];
136     try {
137       await fetch(req.url, {
138         method: req.method,
139         headers: req.headers,
140         body: req.body,
141       });
142       store.delete(key);
143     } catch (err) {
144       console.error('Failed to retry offline request:', err);
145       // Leave the request in the queue if it fails
146     }
147   }
148   await new Promise<void>((resolve, reject) => {
149     tx.oncomplete = () => resolve();
150     tx.onerror = () => reject(tx.error);
151   });
152 }
153 ​
154 // Push notification handlers
155 self.addEventListener('push', (event: PushEvent) => {
156   const data = event.data?.json() || {};
157   const title = data.title || 'Leela OS Notification';
158   const options: NotificationOptions = {
159     body: data.body,
160     icon: data.icon || '/icons/icon-192x192.png',
161     data: data.data,
162   };
163   event.waitUntil(self.registration.showNotification(title, options));
164 });
165 ​
166 self.addEventListener('notificationclick', (event: NotificationEvent) => {
167   event.notification.close();
168   const target = event.notification.data?.url || '/';
169   event.waitUntil(
170     clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
171       for (const client of clientList) {
172         if ('focus' in client) {
173           return (client as WindowClient).focus();
174         }
175       }
176       if (clients.openWindow) {
177         return clients.openWindow(target);
178       }
179       return undefined;
180     })
181   );
182 });
183 
184 // Continue with main branch cache logic
185 caches
186 .open(CACHE_NAME)
187 .then((cache) => cache.put(request, responseClone));
188 return response;
189 });
190 })
191 );
192 return;
193 }