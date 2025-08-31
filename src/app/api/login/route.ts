import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

function parseDb() {
  const url = process.env.DATABASE_URL;
  if (url) return { url };
  const {
    MYSQL_HOST='127.0.0.1', MYSQL_PORT='3310',
    MYSQL_USER='root', MYSQL_PASSWORD='rootpass', MYSQL_DB='pinto'
  } = process.env as any;
  return { host: MYSQL_HOST, port: Number(MYSQL_PORT), user: MYSQL_USER, password: MYSQL_PASSWORD, database: MYSQL_DB };
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ ok: false, error: '아이디/비밀번호를 입력하세요.' }, { status: 400 });
    }
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);
  const [rows] = await conn.query('SELECT id, username, password_hash, name, role, is_active FROM users WHERE username = ?', [username]);
    await conn.end();
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ ok: false, error: '존재하지 않는 계정입니다.' }, { status: 404 });
    }
    const user = (rows as any)[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }
    if (!user.is_active) {
      return NextResponse.json({ ok: false, error: '비활성화된 계정입니다.' }, { status: 403 });
    }
    // 로그인 성공: 최소 정보 반환 (세션/토큰은 추후 구현)
  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
