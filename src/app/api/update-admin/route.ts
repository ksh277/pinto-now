import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

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
    
    await conn.beginTransaction();
    
    try {
      // 1. admin 사용자 비밀번호 업데이트
      const hash = await bcrypt.hash('ha1045', 10);
      await conn.query(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE username = ?',
        [hash, 'admin']
      );
      
      // 2. admin 사용자 프로필 정보 추가/업데이트
      await conn.query(`
        INSERT INTO user_profiles (user_id, nickname, name, phone, created_at, updated_at)
        VALUES (1, 'admin', '관리자', '010-0000-0000', NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        nickname = 'admin',
        name = '관리자', 
        phone = '010-0000-0000',
        updated_at = NOW()
      `);
      
      // 3. admin 권한 부여 (아직 없다면)
      await conn.query(`
        INSERT IGNORE INTO user_roles (user_id, role_id, assigned_by, assigned_at)
        VALUES (1, 4, 1, NOW())
      `);
      
      await conn.commit();
      await conn.end();
      
      return NextResponse.json({ 
        ok: true, 
        message: 'Admin account updated successfully'
      });
      
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  } catch (e: unknown) {
    console.error('Database error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}