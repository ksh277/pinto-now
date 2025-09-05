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
    const { 
      username, 
      email, 
      password, 
      passwordConfirm, 
      name, 
      nickname, 
      phone,
      address
    } = await req.json();

    // 필수 필드 검증
    if (!username || !email || !password || !name || !nickname) {
      return NextResponse.json({ 
        ok: false, 
        error: '필수 항목이 누락되었습니다. (아이디, 이메일, 비밀번호, 이름, 닉네임)' 
      }, { status: 400 });
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      return NextResponse.json({ 
        ok: false, 
        error: '비밀번호가 일치하지 않습니다.' 
      }, { status: 400 });
    }

    const conn = 'url' in parseDb()
      ? await mysql.createConnection(parseDb().url as string)
      : await mysql.createConnection(parseDb() as any);
    
    await conn.beginTransaction();
    
    try {
      // 1. 아이디(username) 중복 체크
      const [usernameRows] = await conn.query('SELECT id FROM users WHERE username = ?', [username]);
      if (Array.isArray(usernameRows) && usernameRows.length > 0) {
        await conn.rollback();
        await conn.end();
        return NextResponse.json({ ok: false, error: '이미 사용 중인 아이디입니다.' }, { status: 409 });
      }

      // 2. 이메일 중복 체크
      const [emailRows] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
      if (Array.isArray(emailRows) && emailRows.length > 0) {
        await conn.rollback();
        await conn.end();
        return NextResponse.json({ ok: false, error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
      }
      
      // 3. 닉네임 중복 체크
      const [nickRows] = await conn.query('SELECT user_id FROM user_profiles WHERE nickname = ?', [nickname]);
      if (Array.isArray(nickRows) && nickRows.length > 0) {
        await conn.rollback();
        await conn.end();
        return NextResponse.json({ ok: false, error: '이미 사용 중인 닉네임입니다.' }, { status: 409 });
      }
      
      // 4. 비밀번호 해시화
      const hash = await bcrypt.hash(password, 10);
      
      // 5. users 테이블에 기본 정보 삽입
      const [userResult] = await conn.query(
        'INSERT INTO users (username, email, password_hash, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [username, email, hash, 'ACTIVE']
      );
      
      const userId = (userResult as any).insertId;
      
      // 6. user_profiles 테이블에 프로필 정보 삽입
      await conn.query(
        'INSERT INTO user_profiles (user_id, nickname, name, phone, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, nickname, name, phone || null]
      );
      
      // 7. 관리자 권한 부여 (username이 'admin'인 경우)
      const roleId = username === 'admin' ? 4 : 1; // 4=ADMIN, 1=USER
      await conn.query(
        'INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at) VALUES (?, ?, ?, NOW())',
        [userId, roleId, userId]
      );
      
      // 8. 배송지 주소 추가 (선택사항)
      if (address && address.receiver && address.line1) {
        await conn.query(
          'INSERT INTO addresses (user_id, type, receiver, phone, zip, line1, line2, city, state, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
          [
            userId, 
            'SHIPPING', 
            address.receiver, 
            address.phone || phone, 
            address.zip || null,
            address.line1,
            address.line2 || null,
            address.city || null,
            address.state || null,
            1 // 첫 주소는 기본 주소로 설정
          ]
        );
      }
      
      await conn.commit();
      await conn.end();
      
      return NextResponse.json({ 
        ok: true, 
        message: '회원가입이 완료되었습니다.',
        userId: userId 
      });
      
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  } catch (e: unknown) {
    return NextResponse.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 });
  }
}
