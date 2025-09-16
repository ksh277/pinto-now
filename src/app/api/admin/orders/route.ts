import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyToken(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // URL 파라미터에서 페이지 정보 가져오기
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 전체 주문 수 조회
    const totalResult = await query('SELECT COUNT(*) as total FROM orders') as any[];
    const total = totalResult[0].total;

    // 주문 목록 조회 (상세 정보 포함)
    const orders = await query(`
      SELECT
        o.id,
        o.order_no,
        o.user_id,
        o.status,
        o.total_amount,
        o.discount_amount,
        o.shipping_fee,
        o.point_used,
        o.addr_snapshot,
        o.memo,
        o.created_at,
        o.updated_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]) as any[];

    // 각 주문의 상품 정보 조회
    for (const order of orders) {
      // addr_snapshot JSON 파싱
      order.address = order.addr_snapshot ? JSON.parse(order.addr_snapshot) : null;

      const items = await query(`
        SELECT
          oi.product_id,
          oi.product_name,
          oi.qty,
          oi.unit_price,
          oi.option_snapshot,
          oi.design_file_name,
          oi.design_file_type,
          oi.design_file_url
        FROM order_items oi
        WHERE oi.order_id = ?
        ORDER BY oi.id
      `, [order.id]) as any[];

      // option_snapshot JSON 파싱
      order.items = items.map((item: any) => ({
        ...item,
        options: item.option_snapshot ? JSON.parse(item.option_snapshot) : null,
        total_price: item.qty * item.unit_price
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get admin orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';