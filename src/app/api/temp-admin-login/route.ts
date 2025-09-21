import { NextRequest, NextResponse } from 'next/server';
import { signToken, computeMaxAge, setSessionCookie } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    // 임시 관리자 계정 생성
    const tempAdmin = {
      id: '999',
      username: 'temp-admin',
      role: 'admin' as const,
      nickname: '임시 관리자'
    };

    const maxAge = computeMaxAge(tempAdmin, false);
    const token = await signToken(tempAdmin, maxAge);

    const response = NextResponse.json({
      success: true,
      user: tempAdmin,
      token: token,
      message: '임시 관리자 로그인 성공'
    });

    setSessionCookie(response, token, maxAge);

    return response;

  } catch (error) {
    console.error('Temp admin login error:', error);
    return NextResponse.json(
      { error: '임시 관리자 로그인 실패' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';