import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const notices = await query(`
      SELECT
        id,
        title,
        description as content,
        type,
        is_active,
        priority,
        created_at as createdAt,
        updated_at as updatedAt
      FROM notices
      WHERE is_active = 1
      ORDER BY priority DESC, created_at DESC
      LIMIT 50
    `) as any[];

    return NextResponse.json({
      success: true,
      notices: notices
    });
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyToken(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, content, type = 'general', priority = 0 } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO notices (title, description, type, priority, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 1, NOW(), NOW())
    `, [title, content, type, priority]);

    const noticeId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      id: noticeId,
      message: '공지사항이 성공적으로 생성되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    return NextResponse.json(
      { error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
