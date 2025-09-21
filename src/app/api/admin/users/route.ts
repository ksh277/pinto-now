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

    // 사용자 목록 조회 (실제 테이블 구조에 맞게 수정) - UTF8 인코딩 명시
    const users = await query(`
      SELECT
        u.id,
        CONVERT(u.email USING utf8mb4) as email,
        CONVERT(u.username USING utf8mb4) as name,
        CASE
          WHEN u.username = 'admin' OR u.username LIKE '%admin%' THEN 'admin'
          ELSE 'user'
        END as role,
        u.status,
        u.created_at,
        u.updated_at as last_login,
        COALESCE(up.points, 0) as points,
        COALESCE(uo.total_orders, 0) as total_orders,
        COALESCE(uo.total_spent, 0) as total_spent
      FROM users u
      LEFT JOIN (
        SELECT user_id, SUM(points) as points
        FROM user_points
        GROUP BY user_id
      ) up ON u.id = up.user_id
      LEFT JOIN (
        SELECT user_id, COUNT(*) as total_orders, SUM(total_amount) as total_spent
        FROM orders
        WHERE status != 'CANCELLED'
        GROUP BY user_id
      ) uo ON u.id = uo.user_id
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