import { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { useToast } from './use-toast';

// Socket context for sharing across the app
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  reconnectAttempts: number;
  joinCoupleRoom: (coupleId: string) => void;
  leaveCoupleRoom: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => () => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  disconnect: () => void;
}

const SocketContext = globalThis.__socketContext || {
  socket: null,
  isConnected: false,
  reconnectAttempts: 0,
  joinCoupleRoom: () => {},
  leaveCoupleRoom: () => {},
  emit: () => {},
  on: () => () => {},
  off: () => {},
  disconnect: () => {},
};

// Global socket instance to prevent multiple connections
let globalSocket: Socket | null = null;
let connectionListeners = new Set<() => void>();

// Event type definitions for better type safety
interface SocketEvents {
  // Couple sync events
  'couple:sync': (data: { partner: string; mood: number; activity: string }) => void;
  'partner:activity': (data: { timestamp: string; activity: string; partner: string }) => void;

  // Memory events
  'memory:created': (data: { memoryId: string; title: string; partner: string }) => void;
  'memory:shared': (data: { memoryId: string; partner: string }) => void;

  // Task events
  'task:completed': (data: { taskId: string; title: string; partner: string; points: number }) => void;
  'task:assigned': (data: { taskId: string; title: string; assignedBy: string; assignedTo: string }) => void;

  // Ritual events
  'ritual:started': (data: { ritualId: string; title: string; partner: string }) => void;
  'ritual:completed': (data: { ritualId: string; title: string; partner: string; bonus: number }) => void;

  // Achievement events
  'achievement:unlocked': (data: { achievementId: string; title: string; partner: string }) => void;

  // Connection events
  'connection': () => void;
  'disconnect': () => void;
  'join:couple': (data: { coupleId: string; partnerCount: number }) => void;
  'leave:couple': (data: { coupleId: string }) => void;

  // Notifications
  'notification:new': (data: any) => void;

  // Live updates
  'streak:bonus': (data: { bonus: number; reason: string }) => void;
  'coins:earned': (data: { coins: number; source: string }) => void;

  // Error handling
  'connect_error': (error: Error) => void;
  'reconnect': () => void;
  'reconnect_attempt': () => void;
  'reconnecting': () => void;
}

export function useSocket() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const currentCoupleId = useRef<string | null>(null);

  // Connect to socket only when user is authenticated
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) {
      return;
    }

    // Create socket connection
    const socketUrl = (typeof window !== 'undefined' && window.location?.origin) || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

    globalSocket = io(socketUrl, {
      path: '/api/socketio',
      auth: {
        userId: session.user.id,
        email: session.user.email,
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    const handleConnect = () => {
      setIsConnected(true);
      setReconnectAttempts(0);

      toast({
        title: "Connected! 🌟",
        description: "Real-time updates are now active for your relationship",
        duration: 3000,
      });

      // Notify all listeners
      connectionListeners.forEach(listener => listener());
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "Lost connection - attempting to reconnect...",
        variant: "destructive",
        duration: 3000,
      });
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to real-time updates",
        variant: "destructive",
      });
    };

    const handleReconnectAttempt = () => {
      setReconnectAttempts(prev => prev + 1);
    };

    const handleReconnect = () => {
      setIsConnected(true);
      setReconnectAttempts(0);
      toast({
        title: "Reconnected! ✅",
        description: "Back online and catching up on updates",
        duration: 3000,
      });
    };

    // Partner activity notifications
    const handlePartnerActivity = (data: any) => {
      const messageMap = {
        'sync': `${data.partner} just synced their daily check-in!`,
        'memory': `${data.partner} created a beautiful new memory`,
        'task': `${data.partner} updated a shared task`,
        'ritual': `${data.partner} is deepening their spiritual connection`,
        'achievement': `${data.partner} unlocked an amazing achievement!`,
      };

      const message = messageMap[data.activity] || `${data.partner} is active!`;

      toast({
        title: "🔔 Partner Activity",
        description: message,
        duration: 5000,
      });
    };

    const handleStreakBonus = (data: any) => {
      toast({
        title: "🔥 Streak Bonus!",
        description: `You earned ${data.bonus} extra coins for your commitment!`,
        duration: 6000,
      });
    };

    const handleCoinsEarned = (data: any) => {
      const sourceMap = {
        'sync': 'Daily sync',
        'memory': 'Special memory',
        'task': 'Task completion',
        'ritual': 'Spiritual practice',
        'achievement': 'New achievement',
        'kindness': 'Kindness act',
      };

      const source = sourceMap[data.source] || data.source;

      toast({
        title: `🪙 ${data.coins} Lakshmi Coins Earned!`,
        description: `${source} - Your relationship is flourishing!`,
        duration: 4000,
      });
    };

    const handleCoupleSync = (data: any) => {
      // Handle couple sync updates - could trigger data refresh
      console.log('Couple sync received:', data);
      // You could emit this to refresh dashboard data
    };

    // Attach event listeners
    globalSocket.on('connect', handleConnect);
    globalSocket.on('disconnect', handleDisconnect);
    globalSocket.on('connect_error', handleConnectError);
    globalSocket.on('reconnect_attempt', handleReconnectAttempt);
    globalSocket.on('reconnect', handleReconnect);

    // Couple events
    globalSocket.on('partner:activity', handlePartnerActivity);
    globalSocket.on('couple:sync', handleCoupleSync);

    // Achievement events
    globalSocket.on('streak:bonus', handleStreakBonus);
    globalSocket.on('coins:earned', handleCoinsEarned);

    // Memory events
    globalSocket.on('memory:created', (data) => {
      toast({
        title: "💝 New Memory!",
        description: `${data.partner} created a memory: "${data.title}"`,
        duration: 6000,
      });
    });

    globalSocket.on('memory:shared', (data) => {
      toast({
        title: "📝 Memory Shared",
        description: `${data.partner} shared a cherished memory with you`,
        duration: 5000,
      });
    });

    // Task events
    globalSocket.on('task:completed', (data) => {
      toast({
        title: "✨ Task Complete!",
        description: `${data.partner} completed "${data.title}" and earned ${data.points} coins!`,
        duration: 5000,
      });
    });

    globalSocket.on('task:assigned', (data) => {
      toast({
        title: "📋 New Task Assigned",
        description: `${data.assignedBy} assigned you a new task: "${data.title}"`,
        duration: 5000,
      });
    });

    // Ritual events
    globalSocket.on('ritual:started', (data) => {
      toast({
        title: "🕉️ Spiritual Journey",
        description: `${data.partner} is exploring "${data.title}" - a sacred practice`,
        duration: 4000,
      });
    });

    globalSocket.on('ritual:completed', (data) => {
      toast({
        title: "🌟 Ritual Complete!",
        description: `${data.partner} completed "${data.title}" and earned ${data.bonus} bonus coins!`,
        duration: 6000,
      });
    });

    return () => {
      // Clean up listeners when component unmounts or user changes
      if (globalSocket) {
        globalSocket.off('connect', handleConnect);
        globalSocket.off('disconnect', handleDisconnect);
        globalSocket.off('connect_error', handleConnectError);
        globalSocket.removeAllListeners();
        globalSocket = null;
      }
    };
  }, [session?.user?.id, session?.user?.email, status, toast]);

  // Room management functions
  const joinCoupleRoom = useCallback((coupleId: string) => {
    if (!globalSocket || !session?.user?.id) {
      console.warn('Cannot join couple room: socket not ready or no session');
      return;
    }

    currentCoupleId.current = coupleId;

    globalSocket.emit('join:couple', {
      coupleId,
      userId: session.user.id,
    });

    // Set up room-specific listeners
    globalSocket.on('join:couple', (data) => {
      toast({
        title: "Welcome to Your Private Space! 💑",
        description: `Connected with ${data.partnerCount} partner${data.partnerCount > 1 ? 's' : ''}`,
        duration: 4000,
      });
    });
  }, [session?.user?.id, toast]);

  const leaveCoupleRoom = useCallback(() => {
    if (!globalSocket || !currentCoupleId.current) return;

    globalSocket.emit('leave:couple', {
      coupleId: currentCoupleId.current,
    });

    currentCoupleId.current = null;
  }, []);

  // Generic socket methods
  const emit = useCallback((event: string, data?: any) => {
    if (!globalSocket || !isConnected) {
      console.warn('Cannot emit: socket not connected');
      return;
    }

    globalSocket.emit(event, data);
  }, [isConnected]);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (!globalSocket) {
      console.warn('Cannot listen: socket not ready');
      return () => {};
    }

    globalSocket.on(event, callback);

    // Return cleanup function
    return () => {
      if (globalSocket) {
        globalSocket.off(event, callback);
      }
    };
  }, []);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (!globalSocket) return;

    if (callback) {
      globalSocket.off(event, callback);
    } else {
      globalSocket.off(event);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (globalSocket) {
      globalSocket.disconnect();
    }
  }, []);

  return {
    socket: globalSocket,
    isConnected,
    reconnectAttempts,
    joinCoupleRoom,
    leaveCoupleRoom,
    emit,
    on,
    off,
    disconnect,
  };
}

// Utility function to listen for specific partner activities
export function usePartnerActivity(partnerId?: string) {
  const [activities, setActivities] = useState<Array<{
    id: string;
    partner: string;
    activity: string;
    timestamp: Date;
  }>>([]);

  useSocket();

  return {
    activities,
    clearActivities: () => setActivities([]),
  };
}

// Hook for real-time couple dashboard updates
export function useLatestOSSocket() {
  return useSocket();
}
