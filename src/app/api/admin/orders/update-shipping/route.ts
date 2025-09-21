import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { orderIds, shippingInfo } = body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: 'Invalid order IDs' }, { status: 400 });
    }

    if (!shippingInfo || !shippingInfo.status) {
      return NextResponse.json({ error: 'Shipping info is required' }, { status: 400 });
    }

    console.log(`📦 배송 정보 업데이트: ${orderIds.length}개 주문`);

    const results = [];

    for (const orderId of orderIds) {
      try {
        // 주문 정보 확인
        const [orders] = await query(
          'SELECT id, order_no, status FROM orders WHERE id = ?',
          [orderId]
        ) as any[];

        if (orders.length === 0) {
          results.push({
            orderId,
            status: 'failed',
            error: '주문을 찾을 수 없습니다'
          });
          continue;
        }

        const order = orders[0];

        // 업데이트할 필드들 준비
        const updateFields: any = {
          status: shippingInfo.status,
          updated_at: new Date()
        };

        // 배송업체 정보가 있으면 추가
        if (shippingInfo.carrier) {
          updateFields.shipping_carrier = shippingInfo.carrier;
        }

        // 운송장 번호가 있으면 추가
        if (shippingInfo.trackingNumber) {
          updateFields.shipping_tracking_number = shippingInfo.trackingNumber;
        }

        // 배송 메모가 있으면 추가
        if (shippingInfo.memo) {
          updateFields.shipping_memo = shippingInfo.memo;
        }

        // 배송 시작일 (상태가 shipped인 경우)
        if (shippingInfo.status === 'shipped') {
          updateFields.shipped_at = new Date();
        }

        // 배송 완료일 (상태가 delivered인 경우)
        if (shippingInfo.status === 'delivered') {
          updateFields.delivered_at = new Date();
          if (!order.shipped_at) {
            updateFields.shipped_at = new Date(); // 배송 시작일도 설정
          }
        }

        // SQL 쿼리 생성
        const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateFields);

        // 주문 상태 업데이트
        await query(
          `UPDATE orders SET ${setClause} WHERE id = ?`,
          [...values, orderId]
        );

        console.log(`✅ 주문 ${order.order_no} 업데이트 완료: ${order.status} → ${shippingInfo.status}`);

        results.push({
          orderId,
          orderNo: order.order_no,
          previousStatus: order.status,
          newStatus: shippingInfo.status,
          status: 'success'
        });

      } catch (error) {
        console.error(`❌ 주문 ${orderId} 업데이트 실패:`, error);
        results.push({
          orderId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const failCount = results.filter(r => r.status === 'failed').length;

    console.log(`📊 배송 정보 업데이트 완료: 성공 ${successCount}개, 실패 ${failCount}개`);

    return NextResponse.json({
      success: true,
      message: `${successCount}개 주문의 배송 정보가 업데이트되었습니다.`,
      results: {
        total: orderIds.length,
        successful: successCount,
        failed: failCount,
        details: results
      },
      shippingInfo
    });

  } catch (error) {
    console.error('배송 정보 업데이트 API 오류:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping info', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 배송 상태별 통계 조회
    const shippingStats = await query(`
      SELECT
        status,
        COUNT(*) as count,
        COUNT(CASE WHEN shipping_tracking_number IS NOT NULL THEN 1 END) as with_tracking,
        COUNT(CASE WHEN shipped_at IS NOT NULL THEN 1 END) as with_shipped_date,
        COUNT(CASE WHEN delivered_at IS NOT NULL THEN 1 END) as with_delivered_date
      FROM orders
      WHERE status IN ('processing', 'shipped', 'delivered')
      GROUP BY status
      ORDER BY
        CASE status
          WHEN 'processing' THEN 1
          WHEN 'shipped' THEN 2
          WHEN 'delivered' THEN 3
          ELSE 4
        END
    `) as any[];

    // 배송업체별 통계
    const carrierStats = await query(`
      SELECT
        shipping_carrier,
        COUNT(*) as count,
        AVG(DATEDIFF(delivered_at, shipped_at)) as avg_delivery_days
      FROM orders
      WHERE shipping_carrier IS NOT NULL
        AND status = 'delivered'
        AND shipped_at IS NOT NULL
        AND delivered_at IS NOT NULL
      GROUP BY shipping_carrier
      ORDER BY count DESC
    `) as any[];

    // 최근 배송 업데이트
    const recentUpdates = await query(`
      SELECT
        id,
        order_no,
        customer_name,
        status,
        shipping_carrier,
        shipping_tracking_number,
        shipped_at,
        delivered_at,
        updated_at
      FROM orders
      WHERE status IN ('shipped', 'delivered')
        AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY updated_at DESC
      LIMIT 20
    `) as any[];

    return NextResponse.json({
      success: true,
      data: {
        shippingStats,
        carrierStats,
        recentUpdates
      }
    });

  } catch (error) {
    console.error('배송 통계 조회 오류:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';