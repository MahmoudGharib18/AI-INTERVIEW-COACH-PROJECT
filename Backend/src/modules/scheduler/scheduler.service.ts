import cron from 'node-cron';
import { runCreateDailySessionJob } from './jobs/create-daily-session.job';
import { runMarkMissedSessionsJob } from './jobs/mark-missed-sessions.job';
import { MISSED_SESSION_SWEEP_INTERVAL_MINUTES } from '@/config/constants';

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