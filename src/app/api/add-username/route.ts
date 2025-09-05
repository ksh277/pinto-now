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

export async function POST(req: NextRequest) {
  try {
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);
    
    // users 테이블에 username 컬럼 추가
    await conn.query(`
      ALTER TABLE users 
      ADD COLUMN username VARCHAR(50) UNIQUE AFTER email
    `);
    
    // 기존 사용자에게 임시 username 할당 (email 기반)
    await conn.query(`
      UPDATE users 
      SET username = SUBSTRING_INDEX(email, '@', 1) 
      WHERE username IS NULL
    `);
    
    await conn.end();
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Username column added successfully'
    });
  } catch (e: unknown) {
    console.error('Database error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}