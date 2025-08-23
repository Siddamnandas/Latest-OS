import IORedis from 'ioredis';
import { logger } from './logger';

export const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  connectTimeout: 1000,
  commandTimeout: 1000,
});

// Handle Redis connection events
redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('ready', () => {
  logger.info('Redis ready for commands');
});

redis.on('error', (err) => {
  logger.warn({ err }, 'Redis connection error - running in degraded mode');
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

// Export a function to check if Redis is available
export const isRedisAvailable = async (): Promise<boolean> => {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    return false;
  }
};