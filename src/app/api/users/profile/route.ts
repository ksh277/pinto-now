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

// GET /api/users/profile - 사용자 프로필 조회
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const users = await query(
      `SELECT id, username, email, name, nickname, phone, tel, zipcode, 
              address1, address2, receive_sms, receive_email, is_lifetime_member, 
              createdAt, updatedAt 
       FROM users WHERE id = ?`,
      [decoded.id]
    );
    
    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: '프로필 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// PUT /api/users/profile - 사용자 프로필 업데이트
export async function PUT(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      nickname,
      phone,
      tel,
      zipcode,
      address1,
      address2,
      receive_sms,
      receive_email,
      is_lifetime_member
    } = data;

    // 닉네임 중복 체크 (자신 제외)
    if (nickname) {
      const existingUsers = await query(
        'SELECT id FROM users WHERE nickname = ? AND id != ?',
        [nickname, decoded.id]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json({ error: '이미 사용 중인 닉네임입니다.' }, { status: 400 });
      }
    }

    // 업데이트 쿼리 구성
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (nickname !== undefined) {
      updateFields.push('nickname = ?');
      updateValues.push(nickname);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (tel !== undefined) {
      updateFields.push('tel = ?');
      updateValues.push(tel);
    }
    if (zipcode !== undefined) {
      updateFields.push('zipcode = ?');
      updateValues.push(zipcode);
    }
    if (address1 !== undefined) {
      updateFields.push('address1 = ?');
      updateValues.push(address1);
    }
    if (address2 !== undefined) {
      updateFields.push('address2 = ?');
      updateValues.push(address2);
    }
    if (receive_sms !== undefined) {
      updateFields.push('receive_sms = ?');
      updateValues.push(receive_sms);
    }
    if (receive_email !== undefined) {
      updateFields.push('receive_email = ?');
      updateValues.push(receive_email);
    }
    if (is_lifetime_member !== undefined) {
      updateFields.push('is_lifetime_member = ?');
      updateValues.push(is_lifetime_member);
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(decoded.id);

    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // 업데이트된 사용자 정보 조회
    const updatedUsers = await query(
      `SELECT id, username, email, name, nickname, phone, tel, zipcode, 
              address1, address2, receive_sms, receive_email, is_lifetime_member, 
              createdAt, updatedAt 
       FROM users WHERE id = ?`,
      [decoded.id]
    );

    const updatedUser = updatedUsers[0];

    return NextResponse.json({ 
      message: '프로필이 성공적으로 업데이트되었습니다.',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: '프로필 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// PATCH /api/users/profile - 사용자 프로필 부분 업데이트 (주문 시 사용)
export async function PATCH(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const data = await request.json();
    const {
      phone,
      realName,
      lastUsedAddress,
      lastUsedZipCode
    } = data;

    // 업데이트 쿼리 구성
    const updateFields = [];
    const updateValues = [];

    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (realName !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(realName);
    }
    if (lastUsedAddress !== undefined) {
      updateFields.push('address1 = ?');
      updateValues.push(lastUsedAddress);
    }
    if (lastUsedZipCode !== undefined) {
      updateFields.push('zipcode = ?');
      updateValues.push(lastUsedZipCode);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: '업데이트할 정보가 없습니다.' });
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(decoded.id);

    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return NextResponse.json({
      success: true,
      message: '사용자 정보가 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('Profile patch error:', error);
    return NextResponse.json({ error: '프로필 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
  }
}