import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    // products 테이블 스키마 조회
    const schemaQuery = `DESCRIBE products`;
    const schema = await query(schemaQuery) as any[];

    return NextResponse.json({
      success: true,
      schema: schema
    });

  } catch (error) {
    console.error('Schema check error:', error);
    return NextResponse.json(
      { error: 'Failed to check schema', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';