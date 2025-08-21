import { Server } from 'socket.io';
import { logger } from '@/lib/logger';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    logger.info({ id: socket.id }, 'Client connected');
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info({ id: socket.id }, 'Client disconnected');
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
  };
