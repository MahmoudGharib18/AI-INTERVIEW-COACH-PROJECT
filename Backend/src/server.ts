import { env } from '@/config/env';
import { connectDB } from '@/config/db';
import { app } from './app';
import { initScheduler } from '@/modules/scheduler/scheduler.service';
import { startEmailWorker } from '@/modules/scheduler/email.worker';

const start = async (): Promise<void> => {
  await connectDB();

  initScheduler();
  startEmailWorker();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

start();