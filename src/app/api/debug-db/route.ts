import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

function parseDb() {
  const url = process.env.DATABASE_URL;
  if (url) return { url };
  const {
    DB_HOST='localhost', DB_PORT='3306',
    DB_USER='root', DB_PASSWORD='12345', DB_NAME='pinto'
  } = process.env;
  return { host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD, database: DB_NAME };
}

export async function GET(req: NextRequest) {
  try {
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);
    
    try {
      // roles 테이블 확인
      const [roles] = await conn.query(`SELECT * FROM roles ORDER BY id`);
      
      // users 테이블 확인
      const [users] = await conn.query(`SELECT id, username, email, status FROM users WHERE username = 'admin'`);
      
      // user_roles 테이블 확인
      const [userRoles] = await conn.query(`SELECT * FROM user_roles WHERE user_id = 1`);
      
      await conn.end();

      return NextResponse.json({ 
        ok: true,
        roles: roles,
        users: users,
        userRoles: userRoles
      });
      
    } catch (error) {
      throw error;
    }
  } catch (e: unknown) {
    console.error('Debug DB error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}