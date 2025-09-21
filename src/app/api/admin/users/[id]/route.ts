import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { role, status, points } = body;

    const updateFields: any = {};
    if (role !== undefined) updateFields.role = role;
    if (status !== undefined) updateFields.status = status;
    if (points !== undefined) updateFields.points = points;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.updated_at = new Date();

    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateFields);

    await query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return NextResponse.json({ success: true, message: 'User updated successfully' });

  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 사용자 상세 정보 조회
    const [user] = await query(`
      SELECT
        u.id,
        u.email,
        u.nickname,
        u.role,
        u.status,
        u.created_at,
        u.last_login,
        u.points,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [id]) as any[];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 최근 주문 내역
    const recentOrders = await query(`
      SELECT
        id,
        order_no,
        total_amount,
        status,
        created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `, [id]) as any[];

    return NextResponse.json({
      user,
      recentOrders: recentOrders || []
    });

  } catch (error) {
    console.error('User detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';