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
    
    // user_profiles 테이블 구조 확인
    const [profileStructure] = await conn.query('DESCRIBE user_profiles');
    
    // users와 user_profiles 조인해서 확인
    const [joinedUsers] = await conn.query(`
      SELECT u.*, up.nickname, up.name, up.phone 
      FROM users u 
      LEFT JOIN user_profiles up ON u.id = up.user_id 
      ORDER BY u.id DESC LIMIT 10
    `);
    
    await conn.end();
    
    return NextResponse.json({ 
      ok: true, 
      profileStructure: profileStructure,
      joinedUsers: joinedUsers,
      count: Array.isArray(joinedUsers) ? joinedUsers.length : 0
    });
  } catch (e: unknown) {
    console.error('Database error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}