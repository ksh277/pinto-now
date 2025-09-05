import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = request.cookies.get('auth_token')?.value || 
                (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST /api/users/change-password
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // 입력 유효성 검사
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' 
      }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: '새 비밀번호는 8자 이상이어야 합니다.' 
      }, { status: 400 });
    }

    // 현재 사용자 조회
    const users = await query(
      'SELECT id, password FROM users WHERE id = ?',
      [decoded.id]
    );
    const user = users[0];

    if (!user || !user.password) {
      return NextResponse.json({ 
        error: '사용자를 찾을 수 없습니다.' 
      }, { status: 404 });
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: '현재 비밀번호가 올바르지 않습니다.' 
      }, { status: 400 });
    }

    // 새 비밀번호가 현재 비밀번호와 같은지 확인
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json({ 
        error: '새 비밀번호는 현재 비밀번호와 다르게 설정해주세요.' 
      }, { status: 400 });
    }

    // 새 비밀번호 해싱
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 비밀번호 업데이트
    await query(
      'UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?',
      [hashedNewPassword, decoded.id]
    );

    return NextResponse.json({ 
      message: '비밀번호가 성공적으로 변경되었습니다.' 
    });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ 
      error: '비밀번호 변경 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}