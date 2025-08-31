import { NextRequest, NextResponse } from 'next/server';
import {
  AuthUser,
  computeMaxAge,
  signToken,
  setSessionCookie,
  Role,
} from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const { username, password, rememberMe } = await req.json();

    // TEMP MOCK: Replace with DB lookup
    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Missing credentials' }, { status: 400 });
    }
    let role: Role = username.endsWith('_admin') ? 'admin' : 'user';
    // TODO: Replace with real DB check
    const user: AuthUser = {
      id: username, // Use username as id for mock
      username,
      role,
    };

    // Password check placeholder (accept any for now)
    // TODO: Replace with real password check

    const maxAge = computeMaxAge(user, !!rememberMe);
    const token = await signToken(user, maxAge);

    const res = NextResponse.json({ ok: true, user });
    setSessionCookie(res, token, maxAge);
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
