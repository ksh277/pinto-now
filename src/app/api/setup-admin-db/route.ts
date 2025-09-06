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
      console.log('🔧 데이터베이스 스키마 설정 시작...');

      // roles 테이블 생성
      await conn.query(`
        CREATE TABLE IF NOT EXISTS roles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // users 테이블 생성
      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // user_profiles 테이블 생성
      await conn.query(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          user_id INT PRIMARY KEY,
          nickname VARCHAR(50) NOT NULL UNIQUE,
          name VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          avatar_url VARCHAR(500),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // user_roles 테이블 생성
      await conn.query(`
        CREATE TABLE IF NOT EXISTS user_roles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          role_id INT NOT NULL,
          assigned_by INT NOT NULL,
          assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
          FOREIGN KEY (assigned_by) REFERENCES users(id),
          UNIQUE KEY unique_user_role (user_id, role_id)
        )
      `);

      // 기본 역할 삽입
      await conn.query(`
        INSERT IGNORE INTO roles (id, name) VALUES 
        (1, 'USER'),
        (2, 'SELLER'),
        (3, 'MODERATOR'),
        (4, 'ADMIN')
      `);

      // admin 사용자의 비밀번호 해시 생성
      const hash = await bcrypt.hash('ha1045', 10);

      // admin 사용자 삽입
      await conn.query(`
        INSERT IGNORE INTO users (id, username, email, password_hash, status) VALUES 
        (1, 'admin', 'admin@pinto.com', ?, 'ACTIVE')
      `, [hash]);

      // admin 프로필 삽입
      await conn.query(`
        INSERT IGNORE INTO user_profiles (user_id, nickname, name, phone) VALUES 
        (1, 'admin', '관리자', '010-0000-0000')
        ON DUPLICATE KEY UPDATE
        nickname = 'admin',
        name = '관리자',
        phone = '010-0000-0000',
        updated_at = CURRENT_TIMESTAMP
      `);

      // admin 역할 부여
      await conn.query(`
        INSERT IGNORE INTO user_roles (user_id, role_id, assigned_by) VALUES 
        (1, 4, 1)
      `);

      // 확인 쿼리
      const [adminUser] = await conn.query(`
        SELECT 
          u.id,
          u.username,
          u.email,
          u.status,
          up.nickname,
          up.name,
          r.name as role_name
        FROM users u 
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.username = 'admin'
      `);

      await conn.commit();
      await conn.end();

      console.log('✅ 데이터베이스 스키마 설정 완료');
      console.log('👤 Admin 사용자 정보:', adminUser);

      return NextResponse.json({ 
        ok: true, 
        message: 'Admin 계정과 데이터베이스 스키마가 성공적으로 설정되었습니다.',
        adminUser: adminUser
      });
      
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  } catch (e: unknown) {
    console.error('Database setup error:', e);
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}