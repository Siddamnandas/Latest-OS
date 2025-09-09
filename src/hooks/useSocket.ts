'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface PartnerPresence {
  partner: string;
  online: boolean;
  lastSeen?: string;
  activity?: string;
}

interface SyncEvent {
  partner: string;
  partnerRole: 'partner_a' | 'partner_b';
  syncData: Record<string, unknown>;
  timestamp: string;
}

interface TaskEvent {
  taskId: string;
  update: Record<string, unknown>;
  updatedBy: string;
  timestamp: string;
}

interface MemoryEvent {
  memory: Record<string, unknown>;
  createdBy: string;
  timestamp: string;
}

interface LocationEvent {
  partner: string;
  location: { lat: number; lng: number; address: string };
  timestamp: string;
}

interface ActivityEvent {
  partner: string;
  activity: string;
  timestamp: string;
}

interface AffectiveGesture {
  type: 'hug' | 'kiss' | 'touch' | 'compliment';
  emoji: string;
  message?: string;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  // Mock session for development - replace with useSession when Auth is properly configured
  const session = useRef({
    user: {
      id: 'dev-user-1',
      name: 'Development User',
      email: 'dev@user.com',
      coupleId: 'dev-couple-1',
      role: 'partner_a'
    }
  }).current;

  const [isConnected, setIsConnected] = useState(false);
  const [partnerPresence, setPartnerPresence] = useState<PartnerPresence>({ partner: '', online: false });
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [taskEvents, setTaskEvents] = useState<TaskEvent[]>([]);
  const [memoryEvents, setMemoryEvents] = useState<MemoryEvent[]>([]);
  const [locationEvents, setLocationEvents] = useState<LocationEvent[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);

  // Initialize socket connection
  useEffect(() => {
    if (!session?.user) return;

    const socket = io(process.env.NODE_ENV === 'development' ? '/' : process.env.NEXT_PUBLIC_SOCKET_URL || '/', {
      path: '/api/socketio',
      addTrailingSlash: false,
      transports: ['websocket', 'polling'],
      secure: process.env.NODE_ENV === 'production',
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: false,
    });

    socketRef.current = socket;

    // Connection event
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Connected to server');

      // Join couple room
      socket.emit('join:couple', {
        userId: session.user.id,
        coupleId: session.user.coupleId,
        partnerRole: (session.user.role === 'partner_a') ? 'partner_a' :
                     (session.user.role === 'partner_b') ? 'partner_b' :
                     'partner_a', // default fallback
        name: session.user.name
      });
    });

    // Connection acknowledgement
    socket.on('couple:joined', (data) => {
      console.log('❤️ Joined couple room', data);
      setPartnerPresence({
        partner: session.user.name === 'Partner A' ? 'Partner B' : 'Partner A',
        online: data.partnersOnline.partner_a && data.partnersOnline.partner_b,
        lastSeen: new Date().toISOString()
      });
    });

    // Partner activity notifications
    socket.on('partner:activity', (data: ActivityEvent) => {
      console.log('👤 Partner activity:', data.activity);
      setActivityFeed(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 activities
      setPartnerPresence(prev => ({ ...prev, activity: data.activity, lastSeen: data.timestamp }));
    });

    // Partner online status
    socket.on('partner:active', (data) => {
      setPartnerPresence(prev => ({ ...prev, online: true, lastSeen: data.lastSeen }));
    });

    // Sync completion notifications
    socket.on('sync:partner_completed', (data: SyncEvent) => {
      console.log('✅ Partner completed sync:', data.partner);
      setSyncEvents(prev => [data, ...prev.slice(0, 9)]);

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${data.partner} completed their daily sync!`, {
          icon: '/logo.svg',
          body: 'Let\'s connect and reflect together 💕'
        });
      }
    });

    // Task update notifications
    socket.on('task:updated', (data: TaskEvent) => {
      console.log('📝 Task updated by partner:', data.updatedBy);
      setTaskEvents(prev => [data, ...prev.slice(0, 9)]);
    });

    socket.on('task:completed', (data) => {
      console.log('🎯 Task completed by partner:', data.completedBy);
      setTaskEvents(prev => [{
        taskId: data.taskId,
        update: { completed: true, title: data.title },
        updatedBy: data.completedBy,
        timestamp: data.timestamp
      }, ...prev.slice(0, 9)]);

      // Show achievement notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${data.completedBy} completed: ${data.title}`, {
          icon: '/logo.svg',
          body: `Earned ${data.coins} Lakshmi Coins 💰`,
          badge: `/coins-${data.coins}.svg`
        });
      }
    });

    // Memory creation notifications
    socket.on('memory:created', (data: MemoryEvent) => {
      console.log('💭 Memory created by partner:', data.createdBy);
      setMemoryEvents(prev => [data, ...prev.slice(0, 9)]);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${data.createdBy} created a new memory!`, {
          icon: '/logo.svg',
          body: 'Check out this special moment 💝'
        });
      }
    });

    // Location sharing (for date planning)
    socket.on('location:shared', (data: LocationEvent) => {
      console.log('📍 Location shared by partner:', data.partner);
      setLocationEvents(prev => [data, ...prev.slice(0, 9)]);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${data.partner} shared a location`, {
          icon: '/logo.svg',
          body: data.location.address
        });
      }
    });

    // Connection errors and disconnection
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('📡 Disconnected from server');
      setPartnerPresence(prev => ({ ...prev, online: false }));
    });

    socket.on('error', (error) => {
      console.error('🚨 Socket error:', error);
      setPartnerPresence(prev => ({ ...prev, online: false }));
    });

    // Welcome message
    socket.on('connection:welcome', (data) => {
      console.log('👋 Welcome message:', data.message);
    });

    // Heartbeat responses
    socket.on('heartbeat:ack', (data) => {
      // Connection is healthy
      setIsConnected(true);
    });

    // Cleanup on unmount or session change
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // Remove session dependency since session is now stable

  // Socket action functions
  const sendSyncStart = useCallback((mood: number, energy: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sync:start', { mood, energy });
    }
  }, [isConnected]);

  const sendSyncComplete = useCallback((syncData: Record<string, unknown>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sync:complete', { syncData });
    }
  }, [isConnected]);

  const sendTaskUpdate = useCallback((taskId: string, update: Record<string, unknown>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('task:update', { taskId, update });
    }
  }, [isConnected]);

  const sendTaskComplete = useCallback((taskId: string, title: string, coins: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('task:complete', { taskId, title, coins });
    }
  }, [isConnected]);

  const sendMemoryCreate = useCallback((memory: Record<string, unknown>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('memory:create', { memory });
    }
  }, [isConnected]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(isTyping ? 'typing:start' : 'typing:stop');
    }
  }, [isConnected]);

  const sendLocation = useCallback((location: { lat: number; lng: number; address: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('location:share', { location });
    }
  }, [isConnected]);

  // Heartbeat to maintain connection
  useEffect(() => {
    if (!isConnected) return;

    const heartbeatInterval = setInterval(() => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit('heartbeat');
      }
    }, 30000); // Send heartbeat every 30 seconds

    return () => clearInterval(heartbeatInterval);
  }, [isConnected]);

  return {
    // Connection state
    isConnected,
    partnerPresence,
    socket: socketRef.current,

    // Event feeds
    syncEvents,
    taskEvents,
    memoryEvents,
    locationEvents,
    activityFeed,

    // Action functions
    sendSyncStart,
    sendSyncComplete,
    sendTaskUpdate,
    sendTaskComplete,
    sendMemoryCreate,
    sendTyping,
    sendLocation
  };
};
