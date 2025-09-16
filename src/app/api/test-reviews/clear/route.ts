import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verify } from 'jsonwebtoken';

function getUserIdFromToken(request: NextRequest): number | null {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) return null;

    const decoded = verify(token, process.env.JWT_SECRET!) as any;
    return decoded.id;
  } catch {
    return null;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // 현재 사용자가 작성한 모든 리뷰 삭제 (테스트용)
    await query(`
      DELETE FROM reviews
      WHERE user_id = ? AND content LIKE '%테스트%'
    `, [userId]);

    return NextResponse.json({
      success: true,
      message: 'Test reviews cleared successfully'
    });

  } catch (error) {
    console.error('Clear test reviews error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}