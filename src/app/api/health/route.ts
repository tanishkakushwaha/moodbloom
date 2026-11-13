import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ app: 'bloom-mood-diary', database: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ app: 'bloom-mood-diary', database: false }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
