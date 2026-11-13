import { NextResponse } from 'next/server';
import { readJson } from '@/lib/api';
import { db } from '@/lib/db';
import { moodSchema, dateSchema } from '@/lib/validation';
import { apiError, requireUser, checkOrigin } from '@/lib/api';
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        const data = moodSchema.parse(await readJson(request));
        const mood = await db.mood.upsert({ where: { userId_date: { userId, date: data.date } }, create: { userId, ...data }, update: data });
        return NextResponse.json(mood);
    }
    catch (e) {
        return apiError(e);
    }
}
export async function DELETE(request: Request) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        const date = dateSchema.parse((await readJson(request) as {
            date?: unknown;
        }).date);
        await db.mood.deleteMany({ where: { userId, date } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
