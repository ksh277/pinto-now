import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    // 우산 상품 (ID: 44) 상태 업데이트 - 아크릴 카테고리로 이동
    await query(`
      UPDATE products
      SET status = 'ACTIVE',
          thumbnail_url = '/images/umbrella-thumbnail.jpg',
          category_id = 1,
          updated_at = NOW()
      WHERE id = 44
    `);

    return NextResponse.json({
      success: true,
      message: '우산 상품이 활성화되었습니다.'
    });

  } catch (error) {
    console.error('Update umbrella error:', error);
    return NextResponse.json(
      { error: 'Failed to update umbrella product' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';