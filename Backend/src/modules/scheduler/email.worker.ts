import { Worker, Job } from 'bullmq';
import { bullConnection, EMAIL_QUEUE_NAME } from '@/jobs/queue.config';
import { sendSessionReminderEmail } from './email.service';
import { SessionReminderEmailJob } from './email.queue';
import { markEmailSent, markEmailFailed } from '@/modules/session/session.service';

export const startEmailWorker = (): Worker => {
  const worker = new Worker<SessionReminderEmailJob>(
    EMAIL_QUEUE_NAME,
    async (job: Job<SessionReminderEmailJob>) => {
      const { toEmail, userName, sessionId } = job.data;
      await sendSessionReminderEmail(toEmail, userName, sessionId);
    },
    { connection: bullConnection }
  );

  worker.on('completed', async (job) => {
    console.log(`✅ Email sent for job ${job.id} (${job.data.toEmail})`);
    try {
      await markEmailSent(job.data.sessionId);
    } catch (err) {
      console.error(`❌ Failed to mark session ${job.data.sessionId} as EMAIL_SENT:`, err);
    }
  });

  worker.on('failed', async (job, err) => {
    console.error(`❌ Email job ${job?.id} failed after retries:`, err.message);
    if (job) {
      try {
        await markEmailFailed(job.data.sessionId);
      } catch (markErr) {
        console.error(`❌ Failed to mark session ${job.data.sessionId} as emailFailed:`, markErr);
      }
    }
  });

  return worker;
};