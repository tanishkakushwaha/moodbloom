import 'server-only';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const globalDb = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};
export const db = globalDb.prisma ?? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 10 }) });
if (process.env.NODE_ENV !== 'production')
    globalDb.prisma = db;
