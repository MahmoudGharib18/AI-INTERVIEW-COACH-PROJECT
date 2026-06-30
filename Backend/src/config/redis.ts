import { env } from "#/config/env.js";
import { Redis } from "ioredis";

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
  lazyConnect: false,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('ready', () => {
  console.log('🚀 Redis authenticated and ready!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});
