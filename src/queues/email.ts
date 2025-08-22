import { Queue, Worker } from 'bullmq';
import { redis } from '@/lib/redis';

export interface EmailJob {
  to: string;
  subject: string;
  body: string;
}

export const emailQueue = new Queue<EmailJob>('email', {
  connection: redis
});

export const emailWorker = new Worker<EmailJob>(
  'email',
  async job => {
    const { to, subject } = job.data;
    // Placeholder for real email sending logic
    console.log(`Sending email to ${to} with subject ${subject}`);
  },
  { connection: redis }
);