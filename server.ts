// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { logger } from '@/lib/logger';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { initSentry } from '@/lib/sentry';
import { isRedisAvailable, redis } from '@/lib/redis';
import { db } from '@/lib/db';
import '@/queues/email';

initSentry();

// Check Redis availability on startup
isRedisAvailable().then(available => {
  if (available) {
    logger.info('Redis is available');
  } else {
    logger.warn('Redis is not available - some features may be limited');
  }
});

const dev = process.env.NODE_ENV !== 'production';
const currentPort = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer(async (req, res) => {
      // Health check endpoint
      if (req.url === '/health') {
        const services: Record<string, boolean> = {};
        try {
          await db.$queryRaw`SELECT 1`;
          services.postgres = true;
          await redis.ping();
          services.redis = true;

          const optional = process.env.OPTIONAL_SERVICE_URLS?.split(',').filter(Boolean) ?? [];
          await Promise.all(
            optional.map(async (url) => {
              const resp = await fetch(url);
              services[url] = resp.ok;
              if (!resp.ok) throw new Error(`Service ${url} unhealthy`);
            })
          );

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', services }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'error', services }));
        }
        return;
      }

      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    await setupSocket(io);

    // Start the server
    server.listen(currentPort, hostname, () => {
      logger.info(`> Ready on http://${hostname}:${currentPort}`);
      logger.info(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
    });

  } catch (err) {
    logger.error({ err }, 'Server startup error');
    process.exit(1);
  }
}

// Start the server
createCustomServer();

