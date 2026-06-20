import { Queue } from 'bullmq';
import { bullConnection, EMAIL_QUEUE_NAME } from '@/jobs/queue.config';

export interface SessionReminderEmailJob {
  toEmail: string;
  userName: string;
  sessionId: string;
}

export const emailQueue = new Queue<SessionReminderEmailJob>(EMAIL_QUEUE_NAME, {
  connection: bullConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s, then 10s, then 20s between retries
    },
    removeOnComplete: true,
    removeOnFail: false, // keep failed jobs visible for debugging
  },
});

export const enqueueSessionReminderEmail = async (
  payload: SessionReminderEmailJob
): Promise<void> => {
  await emailQueue.add('send-reminder', payload);
};