import { Server } from 'socket.io';
import { logger } from '@/lib/logger';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const setupSocket = (io: Server) => {
  // Prisma middleware to emit CRUD events and handle version conflicts
  db.$use(async (params, next) => {
    const action = params.action;
    const model = params.model?.toLowerCase();

    // Optimistic concurrency control: include version in where clause
    if (action === 'update') {
      const version = params.args.data?.version;
      if (typeof version === 'number') {
        params.args.where = { ...params.args.where, version };
        params.args.data.version = { increment: 1 };
      }
    }
    if (action === 'delete') {
      const version = params.args.where?.version;
      if (typeof version === 'number') {
        params.args.where = { ...params.args.where, version };
      }
    }

    try {
      const result = await next(params);
      if (model && ['create', 'update', 'delete'].includes(action)) {
        io.emit(`${model}:${action}`, result);
      }
      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // Version conflict or missing record
        throw new Error('VersionConflict');
      }
      throw error;
    }
  });

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
