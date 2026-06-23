import { EMAIL_QUEUE_NAME, bullConnection } from '#/jobs/queue.config.js';
import { SessionReminderEmailJob } from '#/modules/scheduler/email.queue.js';
import { sendSessionReminderEmail } from '#/modules/scheduler/email.service.js';
import { markEmailFailed, markEmailSent } from '#/modules/session/session.service.js';
import { Worker, Job } from 'bullmq';


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