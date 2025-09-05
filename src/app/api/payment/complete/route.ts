import { NextRequest } from 'next/server';
import { query } from '@/lib/mysql';
import { verify } from 'jsonwebtoken';

function getUserIdFromToken(request: NextRequest): number | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    
    const token = authHeader.substring(7);
    const decoded = verify(token, process.env.JWT_SECRET!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return Response.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { orderId, paymentKey, amount } = await req.json();

    if (!orderId || !paymentKey || !amount) {
      return Response.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // 주문 정보 조회
    const orderResult = await query<{
      id: number;
      user_id: number;
      final_amount: number;
      status: string;
    }[]>(`
      SELECT id, user_id, final_amount, status
      FROM orders 
      WHERE order_id = ? AND user_id = ?
    `, [orderId, userId]);

    if (orderResult.length === 0) {
      return Response.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    const order = orderResult[0];

    // 이미 완료된 주문 체크
    if (order.status === 'completed') {
      return Response.json({
        success: false,
        error: 'Order already completed'
      }, { status: 400 });
    }

    // 결제 금액 검증
    if (order.final_amount !== amount) {
      return Response.json({
        success: false,
        error: 'Amount mismatch'
      }, { status: 400 });
    }

    try {
      // 1. 주문 상태를 완료로 변경
      await query(`
        UPDATE orders 
        SET status = 'completed', updated_at = NOW()
        WHERE order_id = ?
      `, [orderId]);

      // 2. 결제 정보 업데이트
      await query(`
        UPDATE payments 
        SET status = 'completed', payment_key = ?, updated_at = NOW()
        WHERE order_id = ?
      `, [paymentKey, orderId]);

      // 3. 2% 포인트 적립
      const pointsToEarn = Math.floor(amount * 0.02);

      if (pointsToEarn > 0) {
        // 현재 잔액 조회
        const latestBalanceResult = await query<{ balance: number }[]>(`
          SELECT balance 
          FROM point_ledger 
          WHERE user_id = ? 
          ORDER BY created_at DESC, id DESC 
          LIMIT 1
        `, [userId]);

        const currentBalance = latestBalanceResult[0]?.balance || 0;
        const newBalance = currentBalance + pointsToEarn;

        // 포인트 적립 기록 추가
        await query(`
          INSERT INTO point_ledger (user_id, direction, amount, balance, description) 
          VALUES (?, 'EARN', ?, ?, ?)
        `, [userId, pointsToEarn, newBalance, `주문 완료 포인트 적립 (${amount.toLocaleString()}원의 2%)`]);
      }

      return Response.json({
        success: true,
        message: 'Payment completed successfully',
        pointsEarned: pointsToEarn
      });

    } catch (error) {
      console.error('Database error during payment completion:', error);
      return Response.json({
        success: false,
        error: 'Failed to complete payment'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Payment completion error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}