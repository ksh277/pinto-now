import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

interface UserPoints {
  user_id: number;
  available_points: number;
  total_earned_points: number;
  total_used_points: number;
}

export async function GET(req: NextRequest) {
  try {
    // JWT 토큰에서 사용자 정보 추출
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 사용자 포인트 정보 조회
    const userPoints = await query<UserPoints[]>(
      `SELECT 
        user_id,
        COALESCE(SUM(CASE WHEN type = 'earned' THEN amount ELSE 0 END), 0) as total_earned_points,
        COALESCE(SUM(CASE WHEN type = 'used' THEN amount ELSE 0 END), 0) as total_used_points,
        COALESCE(SUM(CASE WHEN type = 'earned' THEN amount WHEN type = 'used' THEN -amount ELSE 0 END), 0) as available_points
       FROM user_points 
       WHERE user_id = ? AND expires_at > NOW()
       GROUP BY user_id`,
      [authUser.id]
    );

    if (userPoints.length === 0) {
      return NextResponse.json({
        availablePoints: 0,
        totalEarnedPoints: 0,
        totalUsedPoints: 0
      });
    }

    const points = userPoints[0];
    return NextResponse.json({
      availablePoints: Math.max(0, points.available_points),
      totalEarnedPoints: points.total_earned_points,
      totalUsedPoints: points.total_used_points
    });

  } catch (error) {
    console.error('Get user points error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, amount, description, orderId } = await req.json();

    if (!type || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid parameters' }, 
        { status: 400 }
      );
    }

    if (!['earned', 'used'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid point type' }, 
        { status: 400 }
      );
    }

    // 포인트 사용 시 잔액 확인
    if (type === 'used') {
      const userPoints = await query<UserPoints[]>(
        `SELECT 
          COALESCE(SUM(CASE WHEN type = 'earned' THEN amount WHEN type = 'used' THEN -amount ELSE 0 END), 0) as available_points
         FROM user_points 
         WHERE user_id = ? AND expires_at > NOW()
         GROUP BY user_id`,
        [authUser.id]
      );

      const availablePoints = userPoints.length > 0 ? userPoints[0].available_points : 0;
      
      if (availablePoints < amount) {
        return NextResponse.json(
          { error: 'Insufficient points' }, 
          { status: 400 }
        );
      }
    }

    // 포인트 만료일 설정 (적립일로부터 1년)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // 포인트 내역 추가
    await query(
      `INSERT INTO user_points (user_id, type, amount, description, order_id, expires_at, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [authUser.id, type, amount, description || '', orderId || null, expiresAt]
    );

    return NextResponse.json({ 
      success: true,
      message: `${amount} points ${type === 'earned' ? 'earned' : 'used'} successfully`
    });

  } catch (error) {
    console.error('Manage user points error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';