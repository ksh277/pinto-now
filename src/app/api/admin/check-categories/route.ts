import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    // categories 테이블 조회
    const categories = await query(`SELECT * FROM categories ORDER BY id`) as any[];

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Categories check error:', error);
    return NextResponse.json(
      { error: 'Failed to check categories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';