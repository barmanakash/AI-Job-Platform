// backend/src/config/redis.ts
import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  reconnectOnError: () => true,
});

redisConnection.on('connect', () => {
  console.log('Connected to Redis instance.');
});

redisConnection.on('error', (err) => {
  console.warn('Redis connection failure; AI queue worker will remain disabled:', err.message || err);
});