import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export class PrismaService {
    private static instance: PrismaClient;

    private constructor() { }

    public static getInstance(): PrismaClient {
        if (!PrismaService.instance) {
            const connectionString = process.env.DATABASE_URL;
            if (!connectionString) {
                throw new Error('DATABASE_URL environment variable is not set');
            }
            
            const pool = new Pool({ connectionString });
            const adapter = new PrismaPg(pool);
            PrismaService.instance = new PrismaClient({ adapter });
        }
        return PrismaService.instance;
    }
}
