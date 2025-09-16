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
    // Admin check - adjust according to your user role system
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET /api/admin/inquiries - 관리자용 문의 내역 조회
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyAdminToken(request);
    if (!decoded) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const inquiries = await query(
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
       ORDER BY i.createdAt DESC`
    );

    // Format data for admin interface
    const formattedInquiries = inquiries.map((inquiry: any) => ({
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
    }));

    return NextResponse.json({ inquiries: formattedInquiries });
  } catch (error) {
    console.error('Admin inquiries fetch error:', error);
    return NextResponse.json({ error: '문의 내역 조회 중 오류가 발생했습니다.' }, { status: 500 });
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