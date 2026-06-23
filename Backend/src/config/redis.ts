import { env } from "#/config/env.js";
import { Redis } from "ioredis";

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});