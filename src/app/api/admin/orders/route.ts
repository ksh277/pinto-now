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

    // URL 파라미터 파싱
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const offset = (page - 1) * limit;

    // WHERE 조건 구성
    let whereConditions = ['1=1'];
    let queryParams: any[] = [];

    if (status && status !== 'all') {
      whereConditions.push('o.status = ?');
      queryParams.push(status);
    }

    if (search) {
      whereConditions.push('o.order_no LIKE ?');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern);
    }

    const whereClause = whereConditions.join(' AND ');

    // 주문 목록 조회 (주문 상품 포함)
    const orders = await query(`
      SELECT
        o.id,
        o.order_no,
        o.user_id,
        o.total_amount,
        o.discount_amount,
        o.shipping_fee,
        o.point_used,
        o.status,
        o.addr_snapshot,
        o.memo,
        o.created_at,
        o.updated_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.qty,
            'unit_price', oi.unit_price,
            'option_snapshot', oi.option_snapshot,
            'design_file_name', oi.design_file_name,
            'design_file_type', oi.design_file_type,
            'design_file_url', oi.design_file_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE ${whereClause}
      GROUP BY o.id, o.order_no, o.user_id, o.total_amount, o.discount_amount, o.shipping_fee, o.point_used, o.status, o.addr_snapshot, o.memo, o.created_at, o.updated_at
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]) as any[];

    // 총 개수 조회
    const [{ total }] = await query(`
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      WHERE ${whereClause}
    `, queryParams) as any[];

    // JSON 문자열을 객체로 파싱
    const processedOrders = orders.map(order => ({
      ...order,
      addr_snapshot: order.addr_snapshot ? (typeof order.addr_snapshot === 'string' ? JSON.parse(order.addr_snapshot) : order.addr_snapshot) : null,
      items: order.items ? order.items.filter((item: any) => item.id !== null) : []
    }));

    return NextResponse.json({
      orders: processedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('Admin orders API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { orderIds, status } = body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: 'Invalid order IDs' }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // 주문 상태 일괄 업데이트
    const placeholders = orderIds.map(() => '?').join(',');
    await query(
      `UPDATE orders SET status = ?, updated_at = NOW() WHERE id IN (${placeholders})`,
      [status, ...orderIds]
    );

    return NextResponse.json({
      success: true,
      message: `${orderIds.length}개 주문의 상태가 업데이트되었습니다.`
    });

  } catch (error) {
    console.error('Bulk order update error:', error);
    return NextResponse.json(
      { error: 'Failed to update orders' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';