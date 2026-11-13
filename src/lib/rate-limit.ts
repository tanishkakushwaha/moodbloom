import { db } from '@/lib/db';
export async function rateLimit(key: string, limit = 10, windowSeconds = 900) {
    const rows = await db.$queryRaw<{
        hits: number;
    }[]> `INSERT INTO "RateLimit" ("key", "hits", "resetAt") VALUES (${key},1,NOW()+${windowSeconds}*INTERVAL '1 second') ON CONFLICT ("key") DO UPDATE SET "hits"=CASE WHEN "RateLimit"."resetAt" < NOW() THEN 1 ELSE "RateLimit"."hits"+1 END, "resetAt"=CASE WHEN "RateLimit"."resetAt" < NOW() THEN NOW()+${windowSeconds}*INTERVAL '1 second' ELSE "RateLimit"."resetAt" END RETURNING "hits"`;
    return rows[0].hits <= limit;
}
