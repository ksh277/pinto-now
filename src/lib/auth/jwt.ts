import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export type Role = 'admin' | 'seller' | 'staff' | 'user';
export type AuthUser = { id: string; username: string; role: Role };

const getEnv = (key: string, fallback: string) =>
  process.env[key] ? process.env[key]! : fallback;

const AUTH_JWT_SECRET = getEnv('AUTH_JWT_SECRET', 'replace-with-a-long-random-secret');
const ADMIN_HOURS = parseInt(getEnv('AUTH_ADMIN_HOURS', '12'), 10);
const USER_DAYS = parseInt(getEnv('AUTH_USER_DAYS', '3'), 10);
const REMEMBER_DAYS = parseInt(getEnv('AUTH_REMEMBER_DAYS', '30'), 10);

const encoder = new TextEncoder();

export function computeMaxAge(user: AuthUser, remember: boolean): number {
  if (['admin', 'seller', 'staff'].includes(user.role)) {
    return ADMIN_HOURS * 60 * 60; // hours to seconds
  }
  if (user.role === 'user') {
    if (remember) return REMEMBER_DAYS * 24 * 60 * 60;
    return USER_DAYS * 24 * 60 * 60;
  }
  return USER_DAYS * 24 * 60 * 60;
}

export async function signToken(user: AuthUser, maxAgeSec: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ ...user, iat: now })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + maxAgeSec)
    .sign(encoder.encode(AUTH_JWT_SECRET));
}

export async function verifyToken(token: string): Promise<(AuthUser & { iat: number }) | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(AUTH_JWT_SECRET));
    const { id, username, role, iat } = payload as JWTPayload & AuthUser & { iat: number };
    if (!id || !username || !role) return null;
    return { id, username, role, iat };
  } catch {
    return null;
  }
}

export function setSessionCookie(
  res: NextResponse,
  token: string,
  maxAgeSec: number
) {
  res.cookies.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: maxAgeSec,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
}

export async function serverGetUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  const user = await verifyToken(token);
  if (!user) return null;
  const { iat, ...rest } = user;
  return rest;
}

/**
 * Sliding refresh: if cookie age > 50% of maxAge, reissue (except admin/seller/staff)
 */
export async function maybeRefreshCookie(
  res: NextResponse,
  user: AuthUser,
  issuedAt: number,
  maxAgeSec: number,
  isAdmin: boolean
) {
  if (isAdmin) return;
  const now = Math.floor(Date.now() / 1000);
  const age = now - issuedAt;
  if (age > maxAgeSec / 2) {
    const newToken = await signToken(user, maxAgeSec);
    setSessionCookie(res, newToken, maxAgeSec);
  }
}
