import { useState, useRef, useEffect, useCallback } from 'react';
import { SYNC_ERROR_CODES, SYNC_CONSTANTS, SyncErrorCode } from '@/lib/config';

interface SyncState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastHeartbeat: Date | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  error: string | null;
  queueSize: number;
  unsyncedItems: number;
}

// WebSocket connection states
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';

interface SyncOptions {
  websocketUrl?: string;
  authToken?: string;
  onConnected?: () => void;
  onDisconnected?: (reason?: string) => void;
  onError?: (error: string) => void;
  onDataReceived?: (data: any) => void;
  onSyncSuccess?: (data: any) => void;
  onSyncError?: (error: string) => void;
  reconnectEnabled?: boolean;
  heartbeatInterval?: number;
}

export function useSync(options: SyncOptions = {}) {
  const {
    websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3000/api/socketio',
    authToken,
    onConnected,
    onDisconnected,
    onError,
    onDataReceived,
    onSyncSuccess,
    onSyncError,
    reconnectEnabled = true,
    heartbeatInterval = SYNC_CONSTANTS.HEARTBEAT_INTERVAL,
  } = options;

  const [state, setState] = useState<SyncState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    reconnectAttempts: 0,
    lastHeartbeat: null,
    connectionQuality: 'disconnected',
    error: null,
    queueSize: 0,
    unsyncedItems: 0,
  });

  const workerRef = useRef<Worker | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize sync worker
  useEffect(() => {
    if (typeof window !== 'undefined' && !workerRef.current) {
      workerRef.current = new Worker('/workers/sync-worker.js');

      workerRef.current.onmessage = (event) => {
        const { success, type, error, data, timestamp } = event.data;

        switch (type) {
          case 'CONNECTION':
            if (data.status === 'connected') {
              setState(prev => ({
                ...prev,
                isConnected: true,
                isConnecting: false,
                isReconnecting: false,
                reconnectAttempts: 0,
                connectionQuality: 'excellent',
                error: null,
              }));
              onConnected?.();
            } else if (data.status === 'disconnected') {
              setState(prev => ({
                ...prev,
                isConnected: false,
                isConnecting: false,
                isReconnecting: false,
                connectionQuality: 'disconnected',
                error: null,
              }));
              onDisconnected?.(data.reason);

              // Auto-reconnect if enabled
              if (reconnectEnabled && data.reason !== 'Client disconnected') {
                scheduleReconnect();
              }
            }
            break;

          case 'ERROR':
            const errorCode = error as SyncErrorCode;
            if (success === false) {
              setState(prev => ({
                ...prev,
                error: error || 'Sync error occurred',
                connectionQuality: 'disconnected',
              }));
              onError?.(error || 'Sync error occurred');
            }
            break;

          case 'DATA':
            onDataReceived?.(data);
            break;

          case 'HEARTBEAT':
            setState(prev => ({
              ...prev,
              lastHeartbeat: new Date(),
              connectionQuality: calculateConnectionQuality(data),
            }));
            break;

          case 'QUEUE':
            setState(prev => ({
              ...prev,
              queueSize: data.remaining || 0,
            }));
            break;

          default:
            // Handle other message types
            break;
        }
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          id: 'cleanup',
          action: 'DISCONNECT_WEBSOCKET',
        });
        workerRef.current.terminate();
        workerRef.current = null;
      }

      // Clean up timeouts
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [reconnectEnabled, websocketUrl]);

  const calculateConnectionQuality = useCallback((heartbeatData: any): SyncState['connectionQuality'] => {
    const { connected, queueSize } = heartbeatData;

    if (!connected) return 'disconnected';
    if (queueSize > 10) return 'poor';
    if (queueSize > 5) return 'good';
    return 'excellent';
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!reconnectEnabled) return;

    setState(prev => ({
      ...prev,
      isReconnecting: true,
      reconnectAttempts: prev.reconnectAttempts + 1,
    }));

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Use progressive backoff delays
    const delayIndex = Math.min(state.reconnectAttempts, SYNC_CONSTANTS.WEBSOCKET_RECONNECT_DELAY.length - 1);
    const delay = SYNC_CONSTANTS.WEBSOCKET_RECONNECT_DELAY[delayIndex];

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [reconnectEnabled, state.reconnectAttempts]);

  const connect = useCallback(async () => {
    if (!workerRef.current) return;

    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    workerRef.current.postMessage({
      id: `connect-${Date.now()}`,
      action: 'CONNECT_WEBSOCKET',
      data: {
        websocketUrl,
        authToken,
      },
    });
  }, [websocketUrl, authToken]);

  const disconnect = useCallback(() => {
    if (!workerRef.current) return;

    setState(prev => ({
      ...prev,
      isConnected: false,
      connectionQuality: 'disconnected',
    }));

    workerRef.current.postMessage({
      id: `disconnect-${Date.now()}`,
      action: 'DISCONNECT_WEBSOCKET',
    });

    onDisconnected?.('User disconnected');
  }, [onDisconnected]);

  const syncData = useCallback(async (
    data: any,
    retryOnFail: boolean = true,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    if (!workerRef.current) {
      const error = 'Sync worker not available';
      setState(prev => ({
        ...prev,
        error,
        unsyncedItems: prev.unsyncedItems + 1,
      }));
      onSyncError?.(error);
      return;
    }

    workerRef.current.postMessage({
      id: `sync-${Date.now()}`,
      action: 'SYNC_DATA',
      data: {
        data,
        retryOnFail,
        priority,
      },
    });

    // Update local state
    setState(prev => ({
      ...prev,
      unsyncedItems: prev.unsyncedItems + 1,
    }));
  }, [onSyncError]);

  const processQueue = useCallback(() => {
    if (!workerRef.current) return;

    workerRef.current.postMessage({
      id: `process-queue-${Date.now()}`,
      action: 'PROCESS_QUEUE',
    });
  }, []);

  const getHeartbeat = useCallback(() => {
    if (!workerRef.current) return;

    workerRef.current.postMessage({
      id: `heartbeat-${Date.now()}`,
      action: 'HEARTBEAT',
    });
  }, []);

  // Auto-heartbeat
  useEffect(() => {
    if (state.isConnected) {
      heartbeatIntervalRef.current = setInterval(() => {
        getHeartbeat();
      }, heartbeatInterval);
    } else {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [state.isConnected, heartbeatInterval, getHeartbeat]);

  // Connection state derived from multiple factors
  const derivedConnectionState: ConnectionState = !navigator.onLine
    ? 'disconnected'
    : state.isConnecting
      ? 'connecting'
      : state.isConnected && state.connectionQuality !== 'disconnected'
        ? 'connected'
        : 'failed';

  return {
    // State
    ...state,
    connectionState: derivedConnectionState,

    // Actions
    connect,
    disconnect,
    syncData,
    processQueue,
    getHeartbeat,

    // Utilities
    isOnline: typeof window !== 'undefined' ? navigator.onLine : false,
    shouldReconnect: reconnectEnabled && !state.isConnected && state.reconnectAttempts < SYNC_CONSTANTS.MAX_RECONNECT_ATTEMPTS,

    // Quality indicators
    isHighQuality: state.connectionQuality === 'excellent',
    isLowQuality: ['poor', 'disconnected'].includes(state.connectionQuality),
  };
}
