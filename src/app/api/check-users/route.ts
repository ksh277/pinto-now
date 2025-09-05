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
    
    // 모든 테이블 확인
    const [tables] = await conn.query('SHOW TABLES');
    
    // users 테이블 구조 확인
    const [structure] = await conn.query('DESCRIBE users');
    
    // 현재 users 테이블의 모든 사용자 확인 (모든 컬럼)
    const [rows] = await conn.query('SELECT * FROM users ORDER BY id DESC LIMIT 10');
    
    await conn.end();
    
    return NextResponse.json({ 
      ok: true, 
      tables: tables,
      structure: structure,
      users: rows,
      count: Array.isArray(rows) ? rows.length : 0
    });
  } catch (e: unknown) {
    console.error('Database error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ ok: false, error: 'Username required' }, { status: 400 });
    }
    
    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);
    
    // 사용자 삭제
    const [result] = await conn.query('DELETE FROM users WHERE username = ?', [username]);
    
    await conn.end();
    
    return NextResponse.json({ 
      ok: true, 
      message: `User ${username} deleted`,
      affectedRows: (result as any).affectedRows
    });
  } catch (e: unknown) {
    console.error('Database error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}