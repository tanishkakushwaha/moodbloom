import { NextResponse } from 'next/server';
import { readJson } from '@/lib/api';
import { db } from '@/lib/db';
import { quotes } from '@/lib/catalog';
import { z } from 'zod';
import { apiError, requireUser, checkOrigin } from '@/lib/api';
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        const { quoteId, saved } = z.object({ quoteId: z.string().refine(id => quotes.some(q => q.id === id)), saved: z.boolean() }).parse(await readJson(request));
        if (saved)
            await db.favoriteQuote.upsert({ where: { userId_quoteId: { userId, quoteId } }, create: { userId, quoteId }, update: {} });
        else
            await db.favoriteQuote.deleteMany({ where: { userId, quoteId } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
