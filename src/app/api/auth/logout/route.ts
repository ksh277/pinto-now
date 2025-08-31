import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/jwt';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}

export const dynamic = 'force-dynamic';
