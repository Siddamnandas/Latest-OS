// Web Worker for Real-time Synchronization
// This handles WebSocket connections, reconnection logic, and data synchronization

interface SyncMessage {
  id: string;
  action: 'CONNECT_WEBSOCKET' | 'DISCONNECT_WEBSOCKET' | 'SYNC_DATA' | 'PROCESS_QUEUE' | 'HEARTBEAT';
  data?: {
    websocketUrl?: string;
    authToken?: string;
    data?: any;
    queue?: SyncQueueItem[];
  };
}

interface SyncResponse {
  id: string;
  success: boolean;
  type: 'CONNECTION' | 'DATA' | 'QUEUE' | 'ERROR' | 'HEARTBEAT';
  error?: string;
  data?: any;
  timestamp: number;
}

interface SyncQueueItem {
  id: string;
  type: 'CREATE_ACTIVITY' | 'UPDATE_SYNC_SESSION' | 'UPDATE_GOAL' | 'NOTIFICATION';
  data: any;
  retryCount: number;
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
}

// Connection state management
let websocket: WebSocket | null = null;
let reconnectAttempts = 0;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let isReconnecting = false;
let syncQueue: SyncQueueItem[] = [];

// Import constants (note: in worker, we can't import, so we'll define them inline)
const WEBSOCKET_RECONNECT_DELAY = [1000, 2000, 5000, 10000, 30000];
const MAX_RECONNECT_ATTEMPTS = 10;
const HEARTBEAT_INTERVAL = 30000;
const QUEUE_MAX_SIZE = 100;

function connectWebSocket(url: string, authToken?: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      postMessage({ id: 'connection-status', success: true, type: 'CONNECTION', data: { status: 'already_connected' }, timestamp: Date.now() });
      resolve(true);
      return;
    }

    try {
      websocket = new WebSocket(url);

      websocket.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0;
        isReconnecting = false;

        // Send authentication if token provided
        if (authToken) {
          websocket!.send(JSON.stringify({
            type: 'AUTHENTICATE',
            token: authToken,
            timestamp: Date.now(),
          }));
        }

        // Start heartbeat
        startHeartbeat();

        postMessage({ id: 'connection-status', success: true, type: 'CONNECTION', data: { status: 'connected' }, timestamp: Date.now() });
        resolve(true);
      };

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          postMessage({
            id: message.id || 'websocket-message',
            success: true,
            type: 'DATA',
            data: message,
            timestamp: Date.now()
          });
        } catch (error) {
          console.warn('Error parsing WebSocket message:', error);
        }
      };

      websocket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        websocket = null;
        stopHeartbeat();

        if (!isReconnecting) {
          postMessage({
            id: 'connection-status',
            success: false,
            type: 'CONNECTION',
            data: { status: 'disconnected', code: event.code, reason: event.reason },
            timestamp: Date.now()
          });

          // Attempt reconnection for abnormal closures
          if (event.code !== 1000 && event.code !== 1001) {
            scheduleReconnect(url, authToken);
          }
        }
      };

      websocket.onerror = (error) => {
        console.warn('WebSocket error:', error);
        postMessage({
          id: 'connection-error',
          success: false,
          type: 'ERROR',
          error: 'WebSocket connection error',
          timestamp: Date.now()
        });
      };

      // Timeout for connection
      setTimeout(() => {
        if (websocket && websocket.readyState !== WebSocket.OPEN) {
          websocket.close();
          postMessage({
            id: 'connection-status',
            success: false,
            type: 'CONNECTION',
            data: { status: 'timeout' },
            timestamp: Date.now()
          });
          resolve(false);
        }
      }, 5000);

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      postMessage({
        id: 'connection-error',
        success: false,
        type: 'ERROR',
        error: 'Failed to create WebSocket connection',
        timestamp: Date.now()
      });
      resolve(false);
    }
  });
}

function startHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }

  heartbeatInterval = setInterval(() => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
    }
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function scheduleReconnect(url: string, authToken?: string) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS || isReconnecting) {
    return;
  }

  isReconnecting = true;
  const delay = WEBSOCKET_RECONNECT_DELAY[reconnectAttempts] || 30000;

  setTimeout(async () => {
    reconnectAttempts++;
    postMessage({
      id: 'reconnection-attempt',
      success: true,
      type: 'CONNECTION',
      data: { attempt: reconnectAttempts, maxAttempts: MAX_RECONNECT_ATTEMPTS },
      timestamp: Date.now()
    });

    const success = await connectWebSocket(url, authToken);
    if (!success && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      scheduleReconnect(url, authToken);
    }
  }, delay);
}

function addToSyncQueue(item: SyncQueueItem) {
  if (syncQueue.length >= QUEUE_MAX_SIZE) {
    // Remove oldest low priority items first
    syncQueue = syncQueue.filter((queueItem, index) =>
      queueItem.priority === 'high' ||
      (queueItem.priority === 'medium' && index > 5)
    );

    if (syncQueue.length >= QUEUE_MAX_SIZE) {
      console.warn('Sync queue is full, dropping oldest item');
      syncQueue.shift();
    }
  }

  syncQueue.push(item);
  postMessage({
    id: 'queue-updated',
    success: true,
    type: 'QUEUE',
    data: { queueSize: syncQueue.length, itemCount: 1 },
    timestamp: Date.now()
  });
}

function processSyncQueue() {
  const processableItems = syncQueue.filter(item =>
    item.retryCount < 3 &&
    websocket &&
    websocket.readyState === WebSocket.OPEN
  );

  processableItems.forEach(item => {
    try {
      websocket!.send(JSON.stringify({
        type: 'SYNC_DATA',
        id: item.id,
        syncType: item.type,
        data: item.data,
        timestamp: Date.now(),
        retryCount: item.retryCount,
      }));

      // Remove from queue after successful send
      syncQueue = syncQueue.filter(q => q.id !== item.id);

    } catch (error) {
      console.warn('Error processing sync item:', error);
      item.retryCount++;

      // If max retries reached, remove from queue and notify
      if (item.retryCount >= 3) {
        syncQueue = syncQueue.filter(q => q.id !== item.id);
        postMessage({
          id: 'sync-failed',
          success: false,
          type: 'ERROR',
          error: `Sync item failed after 3 retries: ${item.id}`,
          data: item,
          timestamp: Date.now()
        });
      }
    }
  });

  // Send queue status
  if (syncQueue.length > 0) {
    postMessage({
      id: 'queue-status',
      success: true,
      type: 'QUEUE',
      data: { remaining: syncQueue.length },
      timestamp: Date.now()
    });
  }
}

function postMessage(response: SyncResponse) {
  (self as any).postMessage(response);
}

// Message handler
self.addEventListener('message', async (event: MessageEvent<SyncMessage>) => {
  const { id, action, data } = event.data;

  switch (action) {
    case 'CONNECT_WEBSOCKET': {
      if (!data?.websocketUrl) {
        postMessage({
          id,
          success: false,
          type: 'ERROR',
          error: 'Missing WebSocket URL',
          timestamp: Date.now()
        });
        return;
      }

      const success = await connectWebSocket(data.websocketUrl, data.authToken);
      postMessage({
        id,
        success,
        type: 'CONNECTION',
        timestamp: Date.now()
      });
      break;
    }

    case 'DISCONNECT_WEBSOCKET': {
      if (websocket) {
        websocket.close(1000, 'Client disconnected');
        websocket = null;
      }
      stopHeartbeat();
      isReconnecting = false;
      reconnectAttempts = 0;

      postMessage({
        id,
        success: true,
        type: 'CONNECTION',
        data: { status: 'disconnected' },
        timestamp: Date.now()
      });
      break;
    }

    case 'SYNC_DATA': {
      if (!data?.data) {
        postMessage({
          id,
          success: false,
          type: 'ERROR',
          error: 'No data provided for sync',
          timestamp: Date.now()
        });
        return;
      }

      if (websocket && websocket.readyState === WebSocket.OPEN) {
        // Send directly if connected
        websocket.send(JSON.stringify({
          type: 'SYNC_DATA',
          id,
          data: data.data,
          timestamp: Date.now(),
        }));

        postMessage({
          id,
          success: true,
          type: 'DATA',
          data: { sent: true },
          timestamp: Date.now()
        });
      } else {
        // Queue for later
        const queueItem: SyncQueueItem = {
          id,
          type: 'CREATE_ACTIVITY',
          data: data.data,
          retryCount: 0,
          timestamp: Date.now(),
          priority: 'medium'
        };
        addToSyncQueue(queueItem);

        postMessage({
          id,
          success: true,
          type: 'DATA',
          data: { queued: true },
          timestamp: Date.now()
        });
      }
      break;
    }

    case 'PROCESS_QUEUE': {
      processSyncQueue();
      postMessage({
        id,
        success: true,
        type: 'QUEUE',
        data: { processed: true, remaining: syncQueue.length },
        timestamp: Date.now()
      });
      break;
    }

    case 'HEARTBEAT': {
      postMessage({
        id,
        success: true,
        type: 'HEARTBEAT',
        data: {
          connected: websocket && websocket.readyState === WebSocket.OPEN,
          queueSize: syncQueue.length,
          reconnectAttempts,
        },
        timestamp: Date.now()
      });
      break;
    }

    default: {
      postMessage({
        id,
        success: false,
        type: 'ERROR',
        error: `Unknown action: ${action}`,
        timestamp: Date.now()
      });
    }
  }
});

// Auto-process queue periodically
setInterval(() => {
  processSyncQueue();
}, 5000); // Every 5 seconds

// Clean up on worker termination
self.addEventListener('beforeunload', () => {
  if (websocket) {
    websocket.close();
  }
  stopHeartbeat();
});
