import { Queue, Worker } from 'bullmq';
import { redis, isRedisAvailable } from '@/lib/redis';
import { logger } from '@/lib/logger';

export interface EmailJob {
  to: string;
  subject: string;
  body: string;
}

let emailQueue: Queue<EmailJob> | null = null;
let emailWorker: Worker<EmailJob> | null = null;

// Initialize queue and worker only if Redis is available
isRedisAvailable().then(available => {
  if (available) {
    try {
      // BullMQ connection configuration
      const connection = {
        host: 'localhost',
        port: 6379,
      };

      emailQueue = new Queue<EmailJob>('email', {
        connection
      });

      emailWorker = new Worker<EmailJob>(
        'email',
        async job => {
          const { to, subject } = job.data;
          // Placeholder for real email sending logic
          logger.info(`Sending email to ${to} with subject ${subject}`);
        },
        { connection }
      );

      logger.info('Email queue and worker initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize email queue');
    }
  } else {
    logger.warn('Email queue disabled - Redis not available');
  }
});

// Helper function to add email jobs
export const addEmailJob = async (emailData: EmailJob) => {
  if (emailQueue) {
    try {
      await emailQueue.add('send-email', emailData);
      logger.info(`Email job queued for ${emailData.to}`);
    } catch (error) {
      logger.error({ error }, 'Failed to queue email job');
      // Fallback: log the email that would have been sent
      logger.info(`Fallback - Would send email to ${emailData.to}: ${emailData.subject}`);
    }
  } else {
    // Fallback when queue is not available
    logger.info(`Email queue not available - Would send email to ${emailData.to}: ${emailData.subject}`);
  }
};

export { emailQueue, emailWorker };