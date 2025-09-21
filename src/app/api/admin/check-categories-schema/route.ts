import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    // categories 테이블 스키마 조회
    const categoriesSchema = await query(`DESCRIBE categories`) as any[];

    return NextResponse.json({
      success: true,
      schema: categoriesSchema
    });

  } catch (error) {
    console.error('Categories schema check error:', error);
    return NextResponse.json(
      { error: 'Failed to check categories schema', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';