import { Queue, Worker, ConnectionOptions } from 'bullmq';
import { redisClient } from '@/config/redis';

// BullMQ wants its own connection config shape, but reusing the same
// underlying Redis instance the rest of the app already connects to
export const bullConnection: ConnectionOptions = {
  host: redisClient.options.host,
  port: redisClient.options.port,
};

export const EMAIL_QUEUE_NAME = 'email-queue';