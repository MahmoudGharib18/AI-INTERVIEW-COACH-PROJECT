import { MISSED_SESSION_SWEEP_INTERVAL_MINUTES } from '#/config/constants.js';
import { runCreateDailySessionJob } from '#/modules/scheduler/jobs/create-daily-session.job.js';
import { runMarkMissedSessionsJob } from '#/modules/scheduler/jobs/mark-missed-sessions.job.js';
import cron from 'node-cron';

export const initScheduler = (): void => {
  // every minute — checks if any user's preferredInterviewTime matches now
  cron.schedule('* * * * *', () => {
    runCreateDailySessionJob().catch((err) =>
      console.error('Create daily session job crashed:', err)
    );
  });

  // every N minutes — sweeps for sessions whose 3hr window has elapsed unopened
  cron.schedule(`*/${MISSED_SESSION_SWEEP_INTERVAL_MINUTES} * * * *`, () => {
    runMarkMissedSessionsJob().catch((err) =>
      console.error('Mark missed sessions job crashed:', err)
    );
  });

  console.log('✅ Scheduler initialized (daily session check + missed-session sweep)');
};