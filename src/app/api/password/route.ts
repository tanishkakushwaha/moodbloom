import { NextResponse } from 'next/server';
import { readJson } from '@/lib/api';
import { db } from '@/lib/db';
import { passwordChangeSchema } from '@/lib/validation';
import { hashPassword, verifyPassword } from '@/lib/password';
import { rateLimit } from '@/lib/rate-limit';
import { apiError, requireUser, checkOrigin, ApiError } from '@/lib/api';
export async function PUT(request: Request) {
    try {
        checkOrigin(request);
        const userId = await requireUser();
        if (!await rateLimit(`password:${userId}`, 5))
            throw new ApiError('Please try again later.', 429);
        const data = passwordChangeSchema.parse(await readJson(request));
        const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
        if (!user.passwordHash || !await verifyPassword(data.currentPassword, user.passwordHash))
            throw new ApiError('Your current password is incorrect.');
        await db.user.update({ where: { id: userId }, data: { passwordHash: await hashPassword(data.newPassword), sessionVersion: { increment: 1 } } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
