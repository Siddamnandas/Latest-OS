import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { logger } from '@/lib/logger';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { getToken } from 'next-auth/jwt';

interface CoupleRoom {
  coupleId: string;
  partnerA?: string;
  partnerB?: string;
}

interface SocketUser {
  userId: string;
  coupleId: string;
  partnerRole: 'partner_a' | 'partner_b';
  name: string;
}

interface SyncCompletePayload {
  syncData: Record<string, unknown>;
}

interface TaskUpdatePayload {
  taskId: string;
  update: Record<string, unknown>;
}

interface MemoryCreatePayload {
  memory: Record<string, unknown>;
}

const ACTIVE_CONNECTIONS_KEY = 'socket:active_connections';
const COUPLE_ROOMS_KEY = 'socket:couple_rooms';

const setActiveConnection = async (socketId: string, user: SocketUser) => {
  await redis.hset(ACTIVE_CONNECTIONS_KEY, socketId, JSON.stringify(user));
};

const getActiveConnection = async (socketId: string): Promise<SocketUser | null> => {
  const data = await redis.hget(ACTIVE_CONNECTIONS_KEY, socketId);
  return data ? (JSON.parse(data) as SocketUser) : null;
};

const removeActiveConnection = async (socketId: string) => {
  await redis.hdel(ACTIVE_CONNECTIONS_KEY, socketId);
};

const getCoupleRoom = async (coupleId: string): Promise<CoupleRoom | null> => {
  const data = await redis.hget(COUPLE_ROOMS_KEY, coupleId);
  return data ? (JSON.parse(data) as CoupleRoom) : null;
};

const setCoupleRoom = async (coupleId: string, room: CoupleRoom) => {
  await redis.hset(COUPLE_ROOMS_KEY, coupleId, JSON.stringify(room));
};

const removeCoupleRoom = async (coupleId: string) => {
  await redis.hdel(COUPLE_ROOMS_KEY, coupleId);
};

export const setupSocket = async (io: Server) => {
  const subClient = redis.duplicate();
  
  // Connect Redis clients only if they aren't already connected
  const connections = [];
  if (redis.status !== 'ready' && redis.status !== 'connecting') {
    connections.push(redis.connect());
  }
  if (subClient.status !== 'ready' && subClient.status !== 'connecting') {
    connections.push(subClient.connect());
  }
  
  if (connections.length > 0) {
    await Promise.all(connections);
  }
  
  io.adapter(createAdapter(redis, subClient));

  // Authenticate socket connections via NextAuth JWT in cookies
  io.use(async (socket, next) => {
    try {
      const cookie = socket.handshake.headers?.cookie || '';
      const reqLike = { headers: { cookie } } as any;
      const secret = process.env.NEXTAUTH_SECRET;
      if (!secret) return next(new Error('Unauthorized'));
      const token: any = await getToken({ req: reqLike, secret });
      if (!token || (!token.id && !token.sub)) return next(new Error('Unauthorized'));

      // Attach session data to socket
      socket.data.userId = (token.id as string) || (token.sub as string);
      socket.data.coupleId = token.coupleId as string | undefined;
      socket.data.name = (token.name as string) || '';
      return next();
    } catch (err) {
      return next(new Error('Unauthorized'));
    }
  });

  // Helper function to emit to couple room
  const emitToCouple = <T>(coupleId: string, event: string, data: T, excludeSocket?: string) => {
    try {
      const room = `couple:${coupleId}`;
      if (excludeSocket) {
        io.to(room).except(excludeSocket).emit(event, data);
      } else {
        io.to(room).emit(event, data);
      }
      logger.debug(`Emitted ${event} to couple ${coupleId}`);
    } catch (error) {
      logger.error({ error }, `Failed to emit ${event} to couple`);
    }
  };

  // Helper function to notify partner activity
  const notifyPartnerActivity = (coupleId: string, partnerName: string, activity: string, socketId: string) => {
    emitToCouple(coupleId, 'partner:activity', {
      partner: partnerName,
      activity,
      timestamp: new Date().toISOString()
    }, socketId);
  };

  io.on('connection', (socket) => {
    logger.info({ id: socket.id }, 'Client connected');

    // Handle couple room joining
    socket.on('join:couple', async (data: { userId: string; coupleId: string; partnerRole: 'partner_a' | 'partner_b'; name: string }) => {
      try {
        const { userId, coupleId, partnerRole, name } = data;

        // Validate identity: must match authenticated user and couple
        if (!socket.data?.userId || socket.data.userId !== userId) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        if (socket.data.coupleId && socket.data.coupleId !== coupleId) {
          socket.emit('error', { message: 'Forbidden: wrong couple' });
          return;
        }

        // Verify in DB that user belongs to couple
        const userRecord = await db.user.findUnique({ where: { id: userId }, select: { couple_id: true, name: true } });
        if (!userRecord || userRecord.couple_id !== coupleId) {
          socket.emit('error', { message: 'Forbidden' });
          return;
        }

        // Store user info
        await setActiveConnection(socket.id, { userId, coupleId, partnerRole, name: name || socket.data.name || 'Partner' });

        // Join couple room
        const roomName = `couple:${coupleId}`;
        await socket.join(roomName);

        // Update couple room info
        const existingRoom = (await getCoupleRoom(coupleId)) || { coupleId };
        if (partnerRole === 'partner_a') {
          existingRoom.partnerA = socket.id;
        } else {
          existingRoom.partnerB = socket.id;
        }
        await setCoupleRoom(coupleId, existingRoom);

        // Notify partner of connection
        notifyPartnerActivity(coupleId, name || socket.data.name || 'Partner', 'connected', socket.id);

        // Send connection confirmation
        socket.emit('couple:joined', {
          coupleId,
          partnerRole,
          partnersOnline: {
            partner_a: !!existingRoom.partnerA,
            partner_b: !!existingRoom.partnerB
          }
        });

        logger.info({ userId, coupleId, partnerRole }, 'User joined couple room');
      } catch (error) {
        logger.error({ error }, 'Failed to join couple room');
        socket.emit('error', { message: 'Failed to join couple room' });
      }
    });

    // Handle sync start notification
    socket.on('sync:start', async (data: { mood: number; energy: number }) => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        notifyPartnerActivity(user.coupleId, user.name, `started daily sync (mood: ${data.mood}, energy: ${data.energy})`, socket.id);
      }
    });

    // Handle sync completion
    socket.on('sync:complete', async (data: SyncCompletePayload) => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        // Emit to partner that sync was completed
        emitToCouple(user.coupleId, 'sync:partner_completed', {
          partner: user.name,
          partnerRole: user.partnerRole,
          syncData: data.syncData,
          timestamp: new Date().toISOString()
        }, socket.id);

        // Check if both partners have synced today for streak bonus
        try {
          const today = new Date().toISOString().split('T')[0];
          const syncs = await db.syncEntry.findMany({
            where: {
              couple_id: user.coupleId,
              created_at: {
                gte: new Date(today),
                lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
              }
            }
          });

          if (syncs.length >= 2) {
            emitToCouple(user.coupleId, 'streak:bonus', {
              message: 'Both partners synced today! Streak bonus earned! 🔥',
              coins: 25
            });
          }
        } catch (error) {
          logger.error({ error }, 'Failed to check sync streak');
        }
      }
    });

    // Handle task updates
    socket.on('task:update', async (data: TaskUpdatePayload) => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        emitToCouple(user.coupleId, 'task:updated', {
          taskId: data.taskId,
          update: data.update,
          updatedBy: user.name,
          timestamp: new Date().toISOString()
        }, socket.id);
      }
    });

    // Handle task completion
    socket.on('task:complete', async (data: { taskId: string; title: string; coins: number }) => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        emitToCouple(user.coupleId, 'task:completed', {
          taskId: data.taskId,
          title: data.title,
          completedBy: user.name,
          coins: data.coins,
          timestamp: new Date().toISOString()
        }, socket.id);
      }
    });

    // Handle memory creation
    socket.on('memory:create', async (data: MemoryCreatePayload) => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        emitToCouple(user.coupleId, 'memory:created', {
          memory: data.memory,
          createdBy: user.name,
          timestamp: new Date().toISOString()
        }, socket.id);
      }
    });

    // Handle typing indicators
    socket.on('typing:start', async () => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        emitToCouple(user.coupleId, 'partner:typing', {
          partner: user.name,
          isTyping: true
        }, socket.id);
      }
    });

    socket.on('typing:stop', async () => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        emitToCouple(user.coupleId, 'partner:typing', {
          partner: user.name,
          isTyping: false
        }, socket.id);
      }
    });

    // Handle live location sharing (for date planning)
    socket.on('location:share', async (data: { location: { lat: number; lng: number; address: string } }) => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        emitToCouple(user.coupleId, 'location:shared', {
          partner: user.name,
          location: data.location,
          timestamp: new Date().toISOString()
        }, socket.id);
      }
    });

    // Handle heartbeat/presence
    socket.on('heartbeat', async () => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        socket.emit('heartbeat:ack', { timestamp: new Date().toISOString() });
        // Update partner with active status
        emitToCouple(user.coupleId, 'partner:active', {
          partner: user.name,
          lastSeen: new Date().toISOString()
        }, socket.id);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      const user = await getActiveConnection(socket.id);
      if (user) {
        // Notify partner of disconnection
        notifyPartnerActivity(user.coupleId, user.name, 'disconnected', socket.id);

        // Update couple room
        const room = await getCoupleRoom(user.coupleId);
        if (room) {
          if (user.partnerRole === 'partner_a' && room.partnerA === socket.id) {
            delete room.partnerA;
          } else if (user.partnerRole === 'partner_b' && room.partnerB === socket.id) {
            delete room.partnerB;
          }

          if (!room.partnerA && !room.partnerB) {
            await removeCoupleRoom(user.coupleId);
          } else {
            await setCoupleRoom(user.coupleId, room);
          }
        }

        await removeActiveConnection(socket.id);
        logger.info({ userId: user.userId, coupleId: user.coupleId }, 'User disconnected');
      } else {
        logger.info({ id: socket.id }, 'Anonymous client disconnected');
      }
    });

    // Send welcome message
    socket.emit('connection:welcome', {
      message: 'Welcome to Latest-OS! Connect with your partner in real-time 💕',
      timestamp: new Date().toISOString(),
    });
  });
};
