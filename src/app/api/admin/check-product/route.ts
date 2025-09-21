import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || '44';

    // 특정 상품의 모든 데이터 조회
    const productQuery = `SELECT * FROM products WHERE id = ?`;
    const product = await query(productQuery, [id]) as any[];

    return NextResponse.json({
      success: true,
      product: product[0] || null
    });

  } catch (error) {
    console.error('Product check error:', error);
    return NextResponse.json(
      { error: 'Failed to check product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';