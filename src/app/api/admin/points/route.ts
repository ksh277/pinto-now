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
    const userId = url.searchParams.get('userId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const type = url.searchParams.get('type'); // 'earn', 'spend', 'admin'

    const offset = (page - 1) * limit;

    if (userId) {
      // 특정 사용자의 포인트 내역 조회
      let whereConditions = ['user_id = ?'];
      let queryParams: any[] = [userId];

      if (type && type !== 'all') {
        whereConditions.push('type = ?');
        queryParams.push(type);
      }

      const whereClause = whereConditions.join(' AND ');

      // 포인트 내역 조회
      const pointHistory = await query(`
        SELECT
          id,
          user_id,
          type,
          points,
          description,
          order_id,
          admin_id,
          created_at
        FROM point_history
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...queryParams, limit, offset]) as any[];

      // 총 개수 조회
      const [{ total }] = await query(`
        SELECT COUNT(*) as total
        FROM point_history
        WHERE ${whereClause}
      `, queryParams) as any[];

      // 사용자 현재 포인트 조회
      const [user] = await query(`
        SELECT id, name, email, points
        FROM users
        WHERE id = ?
      `, [userId]) as any[];

      return NextResponse.json({
        user,
        pointHistory,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } else {
      // 전체 포인트 통계 조회
      const stats = await query(`
        SELECT
          COUNT(DISTINCT user_id) as total_users_with_points,
          SUM(CASE WHEN type = 'earn' THEN points ELSE 0 END) as total_points_earned,
          SUM(CASE WHEN type = 'spend' THEN points ELSE 0 END) as total_points_spent,
          SUM(CASE WHEN type = 'admin' AND points > 0 THEN points ELSE 0 END) as total_admin_added,
          SUM(CASE WHEN type = 'admin' AND points < 0 THEN ABS(points) ELSE 0 END) as total_admin_deducted
        FROM point_history
      `) as any[];

      // 사용자별 포인트 순위 (상위 20명)
      const topUsers = await query(`
        SELECT
          u.id,
          u.nickname,
          u.email,
          u.points,
          COUNT(ph.id) as transaction_count
        FROM users u
        LEFT JOIN point_history ph ON u.id = ph.user_id
        WHERE u.points > 0
        GROUP BY u.id
        ORDER BY u.points DESC
        LIMIT 20
      `) as any[];

      // 최근 포인트 활동
      const recentActivity = await query(`
        SELECT
          ph.id,
          ph.type,
          ph.points,
          ph.description,
          ph.created_at,
          u.nickname as user_name,
          u.email as user_email,
          admin.nickname as admin_name
        FROM point_history ph
        JOIN users u ON ph.user_id = u.id
        LEFT JOIN users admin ON ph.admin_id = admin.id
        ORDER BY ph.created_at DESC
        LIMIT 50
      `) as any[];

      return NextResponse.json({
        stats: stats[0] || {
          total_users_with_points: 0,
          total_points_earned: 0,
          total_points_spent: 0,
          total_admin_added: 0,
          total_admin_deducted: 0
        },
        topUsers,
        recentActivity
      });
    }

  } catch (error) {
    console.error('Admin points API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch points data', details: error instanceof Error ? error.message : 'Unknown error' },
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
    const { userId, points, description, type = 'admin' } = body;

    if (!userId || points === undefined || !description) {
      return NextResponse.json(
        { error: 'userId, points, and description are required' },
        { status: 400 }
      );
    }

    if (typeof points !== 'number' || points === 0) {
      return NextResponse.json(
        { error: 'Points must be a non-zero number' },
        { status: 400 }
      );
    }

    // 트랜잭션 시작
    await query('START TRANSACTION');

    try {
      // 사용자 현재 포인트 조회
      const [user] = await query(
        'SELECT id, points FROM users WHERE id = ?',
        [userId]
      ) as any[];

      if (!user) {
        await query('ROLLBACK');
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const newPoints = user.points + points;

      // 포인트가 음수가 되는지 확인
      if (newPoints < 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { error: 'Insufficient points. Cannot deduct more than current balance.' },
          { status: 400 }
        );
      }

      // 사용자 포인트 업데이트
      await query(
        'UPDATE users SET points = ?, updated_at = NOW() WHERE id = ?',
        [newPoints, userId]
      );

      // 포인트 내역 기록
      await query(`
        INSERT INTO point_history (
          user_id, type, points, description, admin_id, created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())
      `, [userId, type, points, description, authUser.id]);

      await query('COMMIT');

      console.log(`✅ 포인트 ${points > 0 ? '지급' : '차감'} 완료: 사용자 ${userId}, ${points}P`);

      return NextResponse.json({
        success: true,
        message: `포인트 ${points > 0 ? '지급' : '차감'}이 완료되었습니다.`,
        data: {
          userId,
          previousPoints: user.points,
          changedPoints: points,
          newPoints,
          description
        }
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Points adjustment error:', error);
    return NextResponse.json(
      { error: 'Failed to adjust points', details: error instanceof Error ? error.message : 'Unknown error' },
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
    const { userIds, points, description, operation = 'add' } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
    }

    if (typeof points !== 'number' || points === 0) {
      return NextResponse.json(
        { error: 'Points must be a non-zero number' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const adjustmentPoints = operation === 'subtract' ? -Math.abs(points) : Math.abs(points);
    const results = [];

    // 각 사용자에 대해 포인트 조정
    for (const userId of userIds) {
      try {
        await query('START TRANSACTION');

        // 사용자 현재 포인트 조회
        const [user] = await query(
          'SELECT id, nickname, points FROM users WHERE id = ?',
          [userId]
        ) as any[];

        if (!user) {
          await query('ROLLBACK');
          results.push({
            userId,
            status: 'failed',
            error: 'User not found'
          });
          continue;
        }

        const newPoints = user.points + adjustmentPoints;

        // 포인트가 음수가 되는지 확인
        if (newPoints < 0) {
          await query('ROLLBACK');
          results.push({
            userId,
            userName: user.nickname,
            status: 'failed',
            error: 'Insufficient points'
          });
          continue;
        }

        // 사용자 포인트 업데이트
        await query(
          'UPDATE users SET points = ?, updated_at = NOW() WHERE id = ?',
          [newPoints, userId]
        );

        // 포인트 내역 기록
        await query(`
          INSERT INTO point_history (
            user_id, type, points, description, admin_id, created_at
          ) VALUES (?, ?, ?, ?, ?, NOW())
        `, [userId, 'admin', adjustmentPoints, description, authUser.id]);

        await query('COMMIT');

        results.push({
          userId,
          userName: user.nickname,
          status: 'success',
          previousPoints: user.points,
          changedPoints: adjustmentPoints,
          newPoints
        });

      } catch (error) {
        await query('ROLLBACK');
        results.push({
          userId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');

    console.log(`✅ 일괄 포인트 ${operation === 'subtract' ? '차감' : '지급'} 완료`);
    console.log(`   성공: ${successful.length}명, 실패: ${failed.length}명`);

    return NextResponse.json({
      success: true,
      message: `${successful.length}명에게 포인트 ${operation === 'subtract' ? '차감' : '지급'}이 완료되었습니다.`,
      results: {
        successful: successful.length,
        failed: failed.length,
        details: results
      }
    });

  } catch (error) {
    console.error('Bulk points adjustment error:', error);
    return NextResponse.json(
      { error: 'Failed to adjust points', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';