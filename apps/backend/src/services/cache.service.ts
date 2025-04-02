import Redis from 'ioredis';
import { config } from '../config/env';

export class CacheService {
  private redis: Redis;
  private defaultTTL: number = 3600; // 1 hour

  constructor() {
    // this.redis = new Redis({
    //   host: config.redis.host,
    //   port: parseInt(config.redis.port as string, 10),
    //   password: config.redis.password
    // });
    this.redis = new Redis(
      `redis://:${config.redis.password}@${config.redis.host}:${config.redis.port}`
    );
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.redis.set(
      key,
      JSON.stringify(value),
      'EX',
      ttl || this.defaultTTL
    );
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async flush(): Promise<void> {
    await this.redis.flushall();
  }
}
