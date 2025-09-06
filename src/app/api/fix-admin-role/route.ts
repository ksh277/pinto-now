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
    
    await conn.beginTransaction();
    
    try {
      console.log('🔧 Admin 역할 수정 시작...');

      // 먼저 기존 user_roles에서 admin 사용자 역할 삭제
      await conn.query(`DELETE FROM user_roles WHERE user_id = 1`);

      // 먼저 roles 테이블에 ADMIN 역할이 있는지 확인하고 없으면 추가
      await conn.query(`
        INSERT IGNORE INTO roles (id, name) VALUES 
        (2, 'SELLER'),
        (3, 'MODERATOR'),
        (4, 'ADMIN')
      `);

      // admin 역할 다시 부여
      await conn.query(`
        INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES (1, 4, 1)
      `);

      // 확인 쿼리
      const [result] = await conn.query(`
        SELECT 
          u.id,
          u.username,
          u.email,
          up.name,
          r.name as role_name,
          ur.role_id
        FROM users u 
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN user_roles ur ON u.id = ur.user_id  
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.username = 'admin'
      `);

      // roles 테이블도 확인
      const [roles] = await conn.query(`SELECT * FROM roles`);
      
      // user_roles 테이블도 확인
      const [userRoles] = await conn.query(`SELECT * FROM user_roles WHERE user_id = 1`);

      await conn.commit();
      await conn.end();

      console.log('✅ Admin 역할 수정 완료');
      console.log('👤 Admin 사용자 정보:', result);
      console.log('📋 Roles:', roles);
      console.log('🔗 User Roles:', userRoles);

      return NextResponse.json({ 
        ok: true, 
        message: 'Admin 역할이 성공적으로 수정되었습니다.',
        adminUser: result,
        roles: roles,
        userRoles: userRoles
      });
      
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  } catch (e: unknown) {
    console.error('Fix admin role error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}