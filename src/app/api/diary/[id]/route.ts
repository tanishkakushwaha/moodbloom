import { NextResponse } from 'next/server';
import { readJson } from '@/lib/api';
import { db } from '@/lib/db';
import { diarySchema } from '@/lib/validation';
import { apiError, requireUser, checkOrigin, ApiError } from '@/lib/api';
type Context = {
    params: Promise<{
        id: string;
    }>;
};
export async function PUT(request: Request, context: Context) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        const { id } = await context.params;
        const data = diarySchema.parse(await readJson(request));
        const result = await db.diaryEntry.updateMany({ where: { id, userId }, data });
        if (!result.count)
            throw new ApiError('Entry not found.', 404);
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
export async function DELETE(request: Request, context: Context) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        const { id } = await context.params;
        const result = await db.diaryEntry.deleteMany({ where: { id, userId } });
        if (!result.count)
            throw new ApiError('Entry not found.', 404);
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
