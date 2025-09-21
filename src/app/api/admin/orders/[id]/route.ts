import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const orderId = params.id;

    // 주문 상세 정보 조회
    const orderResult = await query(`
      SELECT
        o.id,
        o.order_id,
        o.order_no,
        o.user_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.shipping_address,
        o.total_amount,
        o.final_amount,
        o.status,
        o.payment_method,
        o.payment_status,
        o.created_at,
        o.updated_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price,
            'options', oi.option_snapshot,
            'design_file_name', oi.design_file_name,
            'design_file_type', oi.design_file_type,
            'design_file_url', oi.design_file_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `, [orderId]) as any[];

    if (orderResult.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderResult[0];

    // items가 null인 경우 빈 배열로 처리
    order.items = order.items ? order.items.filter((item: any) => item.id !== null) : [];

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const orderId = params.id;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // 주문 상태 업데이트
    await query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );

    return NextResponse.json({
      success: true,
      message: '주문 상태가 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';