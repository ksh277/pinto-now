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

    console.log('📊 관리자 대시보드 데이터 수집 중...');

    // 1. 전체 통계
    const [overallStats] = await query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE status != 'deleted') as total_users,
        (SELECT COUNT(*) FROM products WHERE status != 'DELETED') as total_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders) as total_revenue
    `) as any[];

    // 2. 오늘 통계
    const [todayStats] = await query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()) as new_users_today,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) as orders_today,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders
         WHERE DATE(created_at) = CURDATE()) as revenue_today
    `) as any[];

    // 3. 주문 상태별 통계
    const orderStatusStats = await query(`
      SELECT
        status,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as total_amount
      FROM orders
      GROUP BY status
      ORDER BY count DESC
    `) as any[];

    // 4. 월별 주문 트렌드 (최근 6개월)
    const monthlyTrend = await query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(DISTINCT user_id) as unique_customers
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `) as any[];

    // 5. 최근 주문
    const recentOrders = await query(`
      SELECT
        o.id,
        o.order_no,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 10
    `) as any[];

    // 6. 사용자 등록 트렌드 (최근 30일)
    const userGrowth = await query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `) as any[];

    // 7. 상품 상태별 통계
    const productStats = await query(`
      SELECT
        status,
        COUNT(*) as count
      FROM products
      WHERE status != 'DELETED'
      GROUP BY status
    `) as any[];

    // 8. 평균 주문 금액
    const [avgOrderValue] = await query(`
      SELECT
        COALESCE(AVG(total_amount), 0) as avg_order_value,
        COALESCE(MIN(total_amount), 0) as min_order_value,
        COALESCE(MAX(total_amount), 0) as max_order_value
      FROM orders
    `) as any[];

    // 9. 주간 트렌드 (최근 4주)
    const weeklyTrend = await query(`
      SELECT
        YEARWEEK(created_at, 1) as week,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(DISTINCT user_id) as unique_customers
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
      GROUP BY YEARWEEK(created_at, 1)
      ORDER BY week DESC
    `) as any[];

    console.log('✅ 대시보드 데이터 수집 완료');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        overview: {
          ...overallStats,
          ...todayStats,
          ...avgOrderValue
        },
        orders: {
          statusBreakdown: orderStatusStats,
          recent: recentOrders,
          monthlyTrend,
          weeklyTrend
        },
        products: {
          statusBreakdown: productStats
        },
        users: {
          growthTrend: userGrowth
        }
      }
    });

  } catch (error) {
    console.error('❌ 대시보드 API 오류:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action, dateRange } = body;

    if (action === 'customReport') {
      // 사용자 정의 리포트 생성
      const { startDate, endDate } = dateRange;

      if (!startDate || !endDate) {
        return NextResponse.json(
          { error: 'Start date and end date are required' },
          { status: 400 }
        );
      }

      console.log(`📈 사용자 정의 리포트 생성: ${startDate} ~ ${endDate}`);

      // 기간별 상세 통계
      const customStats = await query(`
        SELECT
          DATE(o.created_at) as date,
          COUNT(o.id) as order_count,
          COUNT(DISTINCT o.user_id) as unique_customers,
          COALESCE(SUM(o.total_amount), 0) as revenue,
          COALESCE(AVG(o.total_amount), 0) as avg_order_value
        FROM orders o
        WHERE DATE(o.created_at) BETWEEN ? AND ?
        GROUP BY DATE(o.created_at)
        ORDER BY date DESC
      `, [startDate, endDate]) as any[];

      // 기간 요약
      const [periodSummary] = await query(`
        SELECT
          COUNT(o.id) as total_orders,
          COUNT(DISTINCT o.user_id) as unique_customers,
          COALESCE(SUM(o.total_amount), 0) as total_revenue,
          COALESCE(AVG(o.total_amount), 0) as avg_order_value
        FROM orders o
        WHERE DATE(o.created_at) BETWEEN ? AND ?
      `, [startDate, endDate]) as any[];

      return NextResponse.json({
        success: true,
        reportPeriod: { startDate, endDate },
        summary: periodSummary,
        dailyStats: customStats,
        generatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Dashboard POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate custom report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';