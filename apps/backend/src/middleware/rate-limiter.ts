import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import RedisStore, { RedisReply } from 'rate-limit-redis';
import { config } from '../config/env';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port as number
});

export const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<RedisReply>
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from same IP!!!! 🤔'
});
