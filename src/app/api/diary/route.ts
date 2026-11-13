import { NextResponse } from 'next/server';
import { readJson } from '@/lib/api';
import { db } from '@/lib/db';
import { diarySchema } from '@/lib/validation';
import { apiError, requireUser, checkOrigin } from '@/lib/api';
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        const data = diarySchema.parse(await readJson(request));
        const entry = await db.diaryEntry.create({ data: { userId, ...data } });
        return NextResponse.json(entry, { status: 201 });
    }
    catch (e) {
        return apiError(e);
    }
}
