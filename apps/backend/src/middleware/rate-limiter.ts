import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { CacheService } from '../services/cache.service';

CacheService.getInstance();
export const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => {
      if (!CacheService.client) {
        throw new Error('Redis client not initialized');
      }
      return CacheService.client.sendCommand(args);
    }
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from same IP!!!! 🤔'
});
