import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    // 우산 상품 isPublished 상태를 true로 설정
    await query(`
      UPDATE products
      SET status = 'ACTIVE',
          updated_at = NOW()
      WHERE id = 44
    `);

    // 우산 상품 정보 확인
    const product = await query(`
      SELECT id, name, category_id, status, updated_at
      FROM products
      WHERE id = 44
    `) as any[];

    return NextResponse.json({
      success: true,
      product: product[0],
      message: '우산 상품 상태가 활성화되었습니다.'
    });

  } catch (error) {
    console.error('Fix umbrella published error:', error);
    return NextResponse.json(
      { error: 'Failed to fix umbrella published status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';