import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

class Database {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is required but not set');
      }
      const adapter = new PrismaPg({ connectionString: databaseUrl });
      Database.instance = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return Database.instance;
  }

  static async connect(): Promise<void> {
    try {
      await Database.getInstance().$connect();
      // Test the connection with a simple query
      await Database.getInstance().$queryRaw`SELECT 1`;
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    await Database.getInstance().$disconnect();
    console.log('🔌 Database disconnected');
  }
}

export default Database;