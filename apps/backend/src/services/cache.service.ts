import { createClient } from 'redis';
import { config } from '../config/env';

export class CacheService {
  private static instance: CacheService;
  public static client: ReturnType<typeof createClient>;

  private defaultTTL = 3600;
  private isConnected = false;

  private constructor() {
    CacheService.client = createClient({
      username: 'default',
      password: config.redis.password,
      socket: {
        host: config.redis.host,
        port: config.redis.port
      }
    });

    CacheService.client
      .connect()
      .then(() => {
        this.isConnected = true;
      })
      .catch((err) => {
        console.error('Redis initial connection error:', err);
      });

    CacheService.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) return null;

    try {
      const value = await CacheService.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.error('Redis get error:', err);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      await CacheService.client.set(key, JSON.stringify(value), {
        EX: ttl || this.defaultTTL
      });
      return true;
    } catch (err) {
      console.error('Redis set error:', err);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      await CacheService.client.del(key);
      return true;
    } catch (err) {
      console.error('Redis del error:', err);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      await CacheService.client.flushAll();
      return true;
    } catch (err) {
      console.error('Redis flush error:', err);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await CacheService.client.quit();
      this.isConnected = false;
    } catch (err) {
      console.error('Redis disconnect error:', err);
    }
  }
}
