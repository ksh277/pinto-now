import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 사용자 목록 조회 (실제 테이블 구조에 맞게 수정)
    const users = await query(`
      SELECT
        u.id,
        u.email,
        u.username as name,
        CASE
          WHEN u.username = 'admin' THEN 'admin'
          ELSE 'user'
        END as role,
        u.status,
        u.created_at,
        u.updated_at as last_login,
        0 as points,
        0 as total_orders,
        0 as total_spent
      FROM users u
      WHERE u.status != 'DELETED'
      ORDER BY u.created_at DESC
    `) as any[];

    return NextResponse.json({
      users: users || [],
      total: users.length
    });

  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';