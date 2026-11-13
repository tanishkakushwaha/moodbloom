import { NextResponse } from 'next/server';
import { readJson } from '@/lib/api';
import { db } from '@/lib/db';
import { signupSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/password';
import { apiError, ApiError, checkOrigin } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        const data = signupSchema.parse(await readJson(request));
        if (!await rateLimit(`signup:${data.email}`, 5, 3600))
            throw new ApiError('Please wait before trying again.', 429);
        if (await db.user.findUnique({ where: { email: data.email } }))
            throw new ApiError('An account with this email already exists. Try logging in.');
        await db.user.create({ data: { name: data.name, email: data.email, passwordHash: await hashPassword(data.password) } });
        return NextResponse.json({ ok: true }, { status: 201 });
    }
    catch (e) {
        return apiError(e);
    }
}
