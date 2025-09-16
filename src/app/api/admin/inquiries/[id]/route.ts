import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = request.cookies.get('auth_token')?.value ||
                (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role?: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

function getTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'order': '주문/결제',
    'shipping': '배송',
    'product': '상품',
    'etc': '기타'
  };
  return typeMap[type] || type;
}

// GET /api/admin/inquiries/[id] - 관리자용 문의 상세 조회
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const inquiryResult = await query(
      `SELECT
        i.id,
        i.type,
        i.title,
        i.content,
        i.status,
        i.answer,
        i.createdAt,
        i.updatedAt,
        u.nickname,
        u.username,
        u.name
       FROM inquiries i
       LEFT JOIN users u ON i.userId = u.id
       WHERE i.id = ?`,
      [params.id]
    );

    if (!inquiryResult.length) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 });
    }

    const inquiry = inquiryResult[0];
    const formattedInquiry = {
      id: inquiry.id.toString(),
      title: inquiry.title,
      user: {
        nickname: inquiry.nickname || inquiry.username || inquiry.name || '사용자'
      },
      type: getTypeText(inquiry.type),
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      content: inquiry.content,
      answer: inquiry.answer
    };

    return NextResponse.json({ inquiry: formattedInquiry });
  } catch (error) {
    console.error('Admin inquiry detail fetch error:', error);
    return NextResponse.json({ error: '문의 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// PUT /api/admin/inquiries/[id] - 관리자용 문의 답변 및 상태 업데이트
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { answer, status } = await request.json();

    // Update query based on what fields are provided
    const updateFields = [];
    const updateValues = [];

    if (answer !== undefined) {
      updateFields.push('answer = ?');
      updateValues.push(answer);
    }

    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: '업데이트할 내용이 없습니다.' }, { status: 400 });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(params.id);

    const updateQuery = `UPDATE inquiries SET ${updateFields.join(', ')} WHERE id = ?`;

    await query(updateQuery, updateValues);

    // Fetch updated inquiry
    const updatedInquiry = await query(
      `SELECT
        i.id,
        i.type,
        i.title,
        i.content,
        i.status,
        i.answer,
        i.createdAt,
        i.updatedAt,
        u.nickname,
        u.username,
        u.name
       FROM inquiries i
       LEFT JOIN users u ON i.userId = u.id
       WHERE i.id = ?`,
      [params.id]
    );

    const inquiry = updatedInquiry[0];
    const formattedInquiry = {
      id: inquiry.id.toString(),
      title: inquiry.title,
      user: {
        nickname: inquiry.nickname || inquiry.username || inquiry.name || '사용자'
      },
      type: getTypeText(inquiry.type),
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      content: inquiry.content,
      answer: inquiry.answer
    };

    return NextResponse.json({
      message: '문의가 업데이트되었습니다.',
      inquiry: formattedInquiry
    });
  } catch (error) {
    console.error('Admin inquiry update error:', error);
    return NextResponse.json({ error: '문의 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
  }
}