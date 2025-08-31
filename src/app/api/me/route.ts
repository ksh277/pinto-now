import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  computeMaxAge,
  maybeRefreshCookie,
  AuthUser,
  Role,
} from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('session')?.value;
  if (!cookie) {
    return NextResponse.json({ ok: true, user: null });
  }
  const userWithIat = await verifyToken(cookie);
  if (!userWithIat) {
    return NextResponse.json({ ok: true, user: null });
  }
  const { iat, ...user } = userWithIat;
  const isAdmin = ['admin', 'seller', 'staff'].includes(user.role);
  const maxAge = computeMaxAge(user, false); // rememberMe not tracked in JWT, so default to false
  const res = NextResponse.json({ ok: true, user });
  if (!isAdmin && iat) {
    await maybeRefreshCookie(res, user, iat, maxAge, isAdmin);
  }
  return res;
}
