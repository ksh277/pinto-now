import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyRequestAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // iat 제거하고 사용자 정보만 반환
    const { iat, ...userData } = user;

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}