import { NextResponse } from 'next/server';
import { readJson } from '@/lib/api';
import { db } from '@/lib/db';
import { profileSchema } from '@/lib/validation';
import { apiError, requireUser, checkOrigin } from '@/lib/api';
export async function PUT(request: Request) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        const data = profileSchema.parse(await readJson(request));
        await db.user.update({ where: { id: userId }, data: { ...data, image: data.image || null } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
