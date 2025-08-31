import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { computeMaxAge, signToken, setSessionCookie, type AuthUser } from '@/lib/auth/jwt';

function parseDb() {
  const url = process.env.DATABASE_URL;
  if (url) return { url };
  const {
    MYSQL_HOST = '127.0.0.1',
    MYSQL_PORT = '3310',
    MYSQL_USER = 'root',
    MYSQL_PASSWORD = 'rootpass',
    MYSQL_DB = 'pinto',
  } = process.env as any;
  return {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { username, password, rememberMe } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ ok: false, error: '아이디와 비밀번호를 입력하세요.' }, { status: 400 });
    }
    const db = parseDb();
    const conn =
      'url' in db
        ? await mysql.createConnection((db as any).url)
        : await mysql.createConnection(db as any);
    try {
      const [rows] = await conn.execute(
        'SELECT id, username, name, password_hash, role, is_active FROM users WHERE username = ? LIMIT 1',
        [username],
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ ok: false, error: '존재하지 않는 사용자입니다.' }, { status: 404 });
      }
      const row: any = (rows as any)[0];
      const valid = await bcrypt.compare(password, row.password_hash);
      if (!valid) {
        return NextResponse.json({ ok: false, error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
      }
      if (!row.is_active) {
        return NextResponse.json({ ok: false, error: '비활성화된 계정입니다.' }, { status: 403 });
      }
      // ✅ JWT 발급 + HttpOnly 쿠키 저장
      const authUser: AuthUser = {
        id: String(row.id),
        username: row.username,
        role: (row.role || 'user') as any,
      };
      const maxAge = computeMaxAge(authUser, !!rememberMe);
      const token = await signToken(authUser, maxAge);
      const res = NextResponse.json({
        ok: true,
        user: {
          id: String(row.id),
          username: row.username,
          name: row.name,
          role: row.role,
          isAdmin: ['admin', 'seller', 'staff'].includes(row.role),
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
