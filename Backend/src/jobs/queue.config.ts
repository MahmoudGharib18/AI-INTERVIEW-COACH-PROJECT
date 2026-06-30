import { redisClient } from '#/config/redis.js';
import { ConnectionOptions } from 'bullmq';


// BullMQ wants its own connection config shape, but reusing the same
// underlying Redis instance the rest of the app already connects to
export const bullConnection: ConnectionOptions = {
  host: redisClient.options.host,
  port: redisClient.options.port,
  username: redisClient.options.username || 'default',
  password: redisClient.options.password
};

export const EMAIL_QUEUE_NAME = 'email-queue';
