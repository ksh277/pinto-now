import { NextRequest, NextResponse } from 'next/server';
import {
  AuthUser,
  computeMaxAge,
  signToken,
  setSessionCookie,
  Role,
} from '@/lib/auth/jwt';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { username, password, rememberMe } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: '아이디와 비밀번호를 입력하세요.' }, { status: 400 });
    }

    try {
      // 데이터베이스에서 사용자 찾기
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username }
          ]
        },
      });

      if (!dbUser) {
        return NextResponse.json({ ok: false, error: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
      }

      // 계정 상태 확인
      if (dbUser.status !== 'ACTIVE') {
        return NextResponse.json({ ok: false, error: '비활성화된 계정입니다.' }, { status: 401 });
      }

      // 비밀번호 확인
      let passwordMatch = false;
      try {
        // bcrypt 해시와 비교 시도
        passwordMatch = await bcrypt.compare(password, dbUser.password_hash);
      } catch (bcryptError) {
        // bcrypt 실패 시 평문 비교 (개발/테스트 목적)
        passwordMatch = password === dbUser.password_hash;
      }

      if (!passwordMatch) {
        return NextResponse.json({ ok: false, error: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
      }

      // 관리자 권한 확인 (사용자명이 'admin'이거나 이메일에 'admin'이 포함된 경우)
      const role: Role = (dbUser.username === 'admin' || dbUser.email?.includes('admin')) ? 'admin' : 'user';

      const user: AuthUser = {
        id: dbUser.id.toString(),
        username: dbUser.username || '',
        role,
        nickname: dbUser.nickname || undefined,
      };

      const maxAge = computeMaxAge(user, !!rememberMe);
      const token = await signToken(user, maxAge);

      const res = NextResponse.json({ ok: true, user: { ...user, email: dbUser.email } });
      setSessionCookie(res, token, maxAge);
      return res;

    } catch (dbError) {
      console.error('Database login error:', dbError);
      
      // 데이터베이스 오류 시 임시 관리자 로그인 허용
      if (username === 'admin' && password === 'admin123') {
        const user: AuthUser = {
          id: 'temp_admin',
          username: 'admin',
          role: 'admin',
          nickname: 'admin',
        };

        const maxAge = computeMaxAge(user, !!rememberMe);
        const token = await signToken(user, maxAge);

        const res = NextResponse.json({ 
          ok: true, 
          user: { ...user, email: 'admin@pinto.com' },
          note: 'Temporary admin access (DB connection failed)'
        });
        setSessionCookie(res, token, maxAge);
        return res;
      }

      return NextResponse.json({ ok: false, error: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }

  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ ok: false, error: '잘못된 요청입니다.' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
