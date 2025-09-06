'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const joinedRef = useRef(false);

  useEffect(() => {
    const s = io({ path: '/api/socketio' });
    setSocket(s);

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('connection:welcome', (data: any) => {
      toast({ title: 'Connected', description: data?.message || 'Welcome!' });
    });

    // Basic live notifications
    s.on('partner:activity', (data: any) => {
      toast({ title: 'Partner Activity', description: `${data.partner} ${data.activity}` });
    });
    s.on('streak:bonus', (data: any) => {
      toast({ title: 'Streak Bonus 🔥', description: data.message ?? 'Bonus earned!' });
    });
    s.on('task:updated', (data: any) => {
      toast({ title: 'Task Updated', description: `${data.updatedBy} updated a task` });
    });

    return () => {
      s.disconnect();
    };
  }, [toast]);

  // Join couple room using live-data (dev safe)
  useEffect(() => {
    async function joinIfPossible() {
      if (!socket || !connected || joinedRef.current) return;
      try {
        const res = await fetch('/api/couple/live-data');
        const live = await res.json();
        const coupleId: string | undefined = live?.couple?.id;
        if (coupleId) {
          const name = session?.user?.name || 'Dev User';
          const userId = session?.user?.id || `dev-${Date.now()}`;
          socket.emit('join:couple', {
            userId,
            coupleId,
            partnerRole: 'partner_a',
            name,
          });
          joinedRef.current = true;
        }
      } catch (e) {
        // non-fatal
      }
    }
    joinIfPossible();
  }, [socket, connected, session]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
