import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';

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
    if (!username || !email || !password) {
      return NextResponse.json({
        ok: false,
        error: '필수 항목이 누락되었습니다. (아이디, 이메일, 비밀번호)'
      }, { status: 400 });
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      return NextResponse.json({
        ok: false,
        error: '비밀번호가 일치하지 않습니다.'
      }, { status: 400 });
    }

    try {
      // 1. 아이디(username) 중복 체크
      const usernameRows = await query('SELECT id FROM users WHERE username = ?', [username]) as any[];
      if (usernameRows.length > 0) {
        return NextResponse.json({ ok: false, error: '이미 사용 중인 아이디입니다.' }, { status: 409 });
      }

      // 2. 이메일 중복 체크
      const emailRows = await query('SELECT id FROM users WHERE email = ?', [email]) as any[];
      if (emailRows.length > 0) {
        return NextResponse.json({ ok: false, error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
      }

      // 3. 비밀번호 해시화
      const hash = await bcrypt.hash(password, 10);

      // 4. users 테이블에 사용자 삽입 (카카오/네이버와 동일한 구조)
      const result = await query(
        'INSERT INTO users (username, email, password_hash, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [username, email, hash, 'ACTIVE']
      ) as any;

      const userId = result.insertId;

      return NextResponse.json({
        ok: true,
        message: '회원가입이 완료되었습니다.',
        userId: userId
      });

    } catch (error) {
      console.error('Database error during registration:', error);
      return NextResponse.json({
        ok: false,
        error: '회원가입 처리 중 오류가 발생했습니다.'
      }, { status: 500 });
    }
  } catch (e: unknown) {
    console.error('Registration error:', e);
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}
