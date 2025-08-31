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
    const { username, password, name, nickname, phone } = await req.json();
    if (!username || !password || !name || !nickname || !phone) {
      return NextResponse.json({ ok: false, error: '필수 항목 누락' }, { status: 400 });
    }
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);
    // 아이디(유저네임) 중복 체크
    const [rows] = await conn.query('SELECT id FROM users WHERE username = ?', [username]);
    if ((rows as any[]).length > 0) {
      await conn.end();
      return NextResponse.json({ ok: false, error: '이미 사용 중인 아이디' }, { status: 409 });
    }
    // 비밀번호 해시
    const hash = await bcrypt.hash(password, 10);
    // 최고관리자 생성: username이 'admin'이면 role을 'admin'으로 저장
    const role = username === 'admin' ? 'admin' : 'user';
    await conn.query(
      'INSERT INTO users (username, password_hash, name, nickname, phone, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [username, hash, name, nickname, phone, role, 1]
    );
    await conn.end();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
