import { connectDB } from '#/config/db.js';
import { env } from '#/config/env.js';
import { startEmailWorker } from '#/modules/scheduler/email.worker.js';
import { initScheduler } from '#/modules/scheduler/scheduler.service.js';
import { app } from './app.js';

const start = async (): Promise<void> => {
  await connectDB();

  initScheduler();
  startEmailWorker();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

start();