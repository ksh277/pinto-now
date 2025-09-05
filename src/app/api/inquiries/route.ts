import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
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

// GET /api/inquiries - 사용자 문의 내역 조회
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const inquiries = await query(
      `SELECT id, type, title, content, status, answer, createdAt, updatedAt 
       FROM inquiries 
       WHERE userId = ? 
       ORDER BY createdAt DESC`,
      [decoded.id]
    );

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json({ error: '문의 내역 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// POST /api/inquiries - 새 문의 등록
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { type, title, content } = await request.json();

    if (!type || !title || !content) {
      return NextResponse.json({ 
        error: '문의 유형, 제목, 내용을 모두 입력해주세요.' 
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO inquiries (userId, type, title, content, status, createdAt) 
       VALUES (?, ?, ?, ?, 'received', NOW())`,
      [decoded.id, type, title, content]
    );

    const inquiry = await query(
      `SELECT id, type, title, content, status, createdAt 
       FROM inquiries 
       WHERE id = LAST_INSERT_ID()`
    );

    return NextResponse.json({ 
      message: '문의가 성공적으로 등록되었습니다.',
      inquiry: inquiry[0] 
    });
  } catch (error) {
    console.error('Inquiry creation error:', error);
    return NextResponse.json({ error: '문의 등록 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
