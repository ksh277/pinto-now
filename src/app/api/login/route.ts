import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createConnection } from '@/lib/mysql';
import { computeMaxAge, signToken, setSessionCookie, type AuthUser } from '@/lib/auth/jwt';


export async function POST(req: NextRequest) {
  try {
    const { username, password, rememberMe } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ ok: false, error: '아이디와 비밀번호를 입력하세요.' }, { status: 400 });
    }
    const conn = await createConnection();
    try {
      const [rows] = await conn.execute(`
        SELECT u.id, u.username, u.nickname, up.name, u.password_hash, u.status, 
               COALESCE(r.name, 'USER') as role
        FROM users u 
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN user_roles ur ON u.id = ur.user_id  
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.username = ? 
        LIMIT 1
      `, [username]);
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ ok: false, error: '존재하지 않는 사용자입니다.' }, { status: 404 });
      }
      const row: any = (rows as any)[0];
      const valid = await bcrypt.compare(password, row.password_hash);
      if (!valid) {
        return NextResponse.json({ ok: false, error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
      }
      if (row.status !== 'ACTIVE') {
        return NextResponse.json({ ok: false, error: '비활성화된 계정입니다.' }, { status: 403 });
      }
      // ✅ JWT 발급 + HttpOnly 쿠키 저장
      const authUser: AuthUser = {
        id: String(row.id),
        username: row.username,
        role: (row.role || 'user') as any,
        nickname: row.nickname,
      };
      const maxAge = computeMaxAge(authUser, !!rememberMe);
      const token = await signToken(authUser, maxAge);
      const res = NextResponse.json({
        ok: true,
        user: {
          id: String(row.id),
          username: row.username,
          nickname: row.nickname,
          name: row.name,
          role: row.role,
          isAdmin: ['ADMIN', 'STAFF'].includes(row.role),
        },
      });
      setSessionCookie(res, token, maxAge); // ← HttpOnly 쿠키 세팅
      return res;
    } finally {
      await conn.end().catch(() => {});
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || '로그인 처리 중 오류' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
