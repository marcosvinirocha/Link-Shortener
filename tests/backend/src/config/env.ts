import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(10),
  PORT: z.string().default('3001'),
  BASE_URL: z.string().url().default('http://localhost:3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type EnvConfig = z.infer<typeof envSchema>;

class Environment {
  private static config: EnvConfig;

  static load(): EnvConfig {
    if (!Environment.config) {
      try {
        Environment.config = envSchema.parse(process.env);
      } catch (error) {
        console.error('❌ Invalid environment variables:', error);
        process.exit(1);
      }
    }
    return Environment.config;
  }

  static get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    if (!Environment.config) {
      Environment.load();
    }
    return Environment.config[key];
  }
}

export default Environment;