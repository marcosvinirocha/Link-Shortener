import Redis from 'ioredis';

class RedisClient {
  private static instance: Redis | null = null;

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 3,
        retryStrategy(times: number) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        lazyConnect: true,
      });

      RedisClient.instance.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      RedisClient.instance.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
      });
    }
    return RedisClient.instance;
  }

  static async connect(): Promise<void> {
    try {
      await RedisClient.getInstance().connect();
    } catch (error) {
      console.warn('⚠️ Redis connection failed, continuing without cache:', error);
    }
  }

  static async disconnect(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
      RedisClient.instance = null;
      console.log('🔌 Redis disconnected');
    }
  }

  static async get(key: string): Promise<string | null> {
    try {
      return await RedisClient.getInstance().get(key);
    } catch {
      return null;
    }
  }

  static async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await RedisClient.getInstance().setex(key, ttl, value);
      } else {
        await RedisClient.getInstance().set(key, value);
      }
    } catch {
      // Silently fail if Redis is unavailable
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await RedisClient.getInstance().del(key);
    } catch {
      // Silently fail if Redis is unavailable
    }
  }
}

export default RedisClient;