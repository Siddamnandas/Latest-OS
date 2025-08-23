import { Queue, Worker } from 'bullmq';
import { isRedisAvailable } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { db } from '@/lib/db';

export interface NotificationJob {
  notificationId: string;
}

let notificationQueue: Queue<NotificationJob> | null = null;
let notificationWorker: Worker<NotificationJob> | null = null;

isRedisAvailable().then((available) => {
  if (available) {
    try {
      const connection = {
        host: 'localhost',
        port: 6379,
      };

      notificationQueue = new Queue<NotificationJob>('notifications', {
        connection,
      });

      notificationWorker = new Worker<NotificationJob>(
        'notifications',
        async (job) => {
          const { notificationId } = job.data;
          try {
            await db.notification.update({
              where: { id: notificationId },
              data: { is_delivered: true, delivered_at: new Date() },
            });
            logger.info(`Notification ${notificationId} delivered`);
          } catch (error) {
            logger.error({ error }, `Failed to deliver notification ${notificationId}`);
          }
        },
        { connection }
      );

      logger.info('Notification queue and worker initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize notification queue');
    }
  } else {
    logger.warn('Notification queue disabled - Redis not available');
  }
});

export const addNotificationJob = async (
  data: NotificationJob,
  sendAt?: Date
) => {
  if (notificationQueue) {
    try {
      const delay = sendAt ? Math.max(sendAt.getTime() - Date.now(), 0) : 0;
      await notificationQueue.add('send-notification', data, { delay });
      logger.info(`Notification job queued for ${data.notificationId}`);
    } catch (error) {
      logger.error({ error }, 'Failed to queue notification job');
    }
  } else {
    logger.info(
      `Notification queue not available - Would send notification ${data.notificationId}`
    );
  }
};

export { notificationQueue, notificationWorker };

