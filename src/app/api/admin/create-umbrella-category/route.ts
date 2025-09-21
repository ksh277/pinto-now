import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    // 우산 카테고리 생성 (실제 스키마에 맞춤)
    const result = await query(`
      INSERT INTO categories (name, slug, description, icon_url, is_active)
      VALUES (?, ?, ?, ?, ?)
    `, ['우산', 'umbrella', '비오는 날을 특별하게 만드는 우산', '/images/umbrella-category.jpg', 1]) as any;

    const categoryId = result.insertId;

    // 우산 상품 (ID: 44)을 새로 만든 우산 카테고리로 이동 및 상태 업데이트
    await query(`
      UPDATE products
      SET status = 'ACTIVE',
          thumbnail_url = '/images/umbrella-thumbnail.jpg',
          category_id = ?,
          updated_at = NOW()
      WHERE id = 44
    `, [categoryId]);

    return NextResponse.json({
      success: true,
      categoryId: categoryId,
      message: '우산 카테고리가 생성되고 우산 상품이 이동되었습니다.'
    });

  } catch (error) {
    console.error('Create umbrella category error:', error);
    return NextResponse.json(
      { error: 'Failed to create umbrella category', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';