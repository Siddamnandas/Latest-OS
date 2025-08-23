'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useLatestOSSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const s = io({ path: '/api/socketio' });
    setSocket(s);
    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));
    return () => s.disconnect();
  }, []);

  return { socket, isConnected };
};