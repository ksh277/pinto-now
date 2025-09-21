import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 최근 3개월 기준 날짜 계산
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // 주문 상태별 통계 조회
    const orderStats = await query<{
      status: string;
      count: number;
    }[]>(
      `SELECT status, COUNT(*) as count 
       FROM orders 
       WHERE user_id = ? AND created_at >= ?
       GROUP BY status`,
      [authUser.id, threeMonthsAgo.toISOString()]
    );

    // 취소/교환/반품 통계 조회 (향후 claim_orders 테이블이 있다면)
    // 현재는 기본값으로 설정
    const claimStats = await query<{
      type: string;
      count: number;
    }[]>(
      `SELECT 
        CASE 
          WHEN status = 'cancelled' THEN 'cancelled'
          WHEN status = 'exchanged' THEN 'exchanged' 
          WHEN status = 'returned' THEN 'returned'
          ELSE NULL
        END as type,
        COUNT(*) as count
       FROM orders 
       WHERE user_id = ? 
         AND created_at >= ?
         AND status IN ('cancelled', 'exchanged', 'returned')
       GROUP BY type
       HAVING type IS NOT NULL`,
      [authUser.id, threeMonthsAgo.toISOString()]
    );

    // 통계 데이터 정리
    const orderStatus = {
      paymentPending: orderStats.find(s => s.status === 'pending')?.count || 0,
      preparing: orderStats.find(s => s.status === 'preparing')?.count || 0,
      shipping: orderStats.find(s => s.status === 'shipping')?.count || 0,
      delivered: orderStats.find(s => s.status === 'completed')?.count || 0,
    };

    const claimStatus = {
      cancelled: claimStats.find(s => s.type === 'cancelled')?.count || 0,
      exchanged: claimStats.find(s => s.type === 'exchanged')?.count || 0,
      returned: claimStats.find(s => s.type === 'returned')?.count || 0,
    };

    return NextResponse.json({
      orderStatus,
      claimStatus
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';