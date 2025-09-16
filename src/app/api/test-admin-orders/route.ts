import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    console.log('=== 관리자 주문 조회 테스트 ===');

    // 전체 주문 수 조회
    const totalResult = await query('SELECT COUNT(*) as total FROM orders') as any[];
    const total = totalResult[0].total;

    // 주문 목록 조회 (최대 5개)
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
      LIMIT 5
    `) as any[];

    // 각 주문의 상품 정보 조회
    for (const order of orders) {
      // addr_snapshot JSON 파싱
      if (order.addr_snapshot && typeof order.addr_snapshot === 'string') {
        try {
          order.address = JSON.parse(order.addr_snapshot);
        } catch (e) {
          console.error('Failed to parse addr_snapshot for order', order.id);
          order.address = null;
        }
      } else {
        order.address = order.addr_snapshot;
      }

      // 주문 상품들 조회
      const items = await query(`
        SELECT
          oi.id,
          oi.product_id,
          oi.product_name,
          oi.qty,
          oi.unit_price,
          oi.option_snapshot,
          oi.design_file_name,
          oi.design_file_type,
          oi.design_file_url,
          oi.created_at
        FROM order_items oi
        WHERE oi.order_id = ?
        ORDER BY oi.id
      `, [order.id]) as any[];

      // option_snapshot JSON 파싱 및 total_price 계산
      order.items = items.map((item: any) => {
        try {
          return {
            ...item,
            options: typeof item.option_snapshot === 'string' ? JSON.parse(item.option_snapshot) : item.option_snapshot || null,
            total_price: parseFloat(item.unit_price) * item.qty
          };
        } catch (e) {
          console.error('Failed to parse option_snapshot for item', item.id);
          return {
            ...item,
            options: null,
            total_price: parseFloat(item.unit_price) * item.qty
          };
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: '관리자 주문 조회 테스트 완료',
      data: {
        orders,
        totalOrders: total,
        summary: {
          ordersWithDesignFiles: orders.filter(o => o.items.some((i: any) => i.design_file_name)).length,
          totalItems: orders.reduce((sum, o) => sum + o.items.length, 0),
          latestOrderNumber: orders.length > 0 ? orders[0].order_no : null
        }
      }
    });

  } catch (error) {
    console.error('Test admin orders error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test admin orders',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}