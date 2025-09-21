import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET /api/faq - 공개 FAQ 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // 먼저 faqs 테이블이 존재하는지 확인
    let faqs = [];

    try {
      let sql = `SELECT id, category, question, answer, sort_order, created_at
                 FROM faqs
                 WHERE is_public = 1`;
      const params: any[] = [];

      if (category) {
        sql += ` AND category = ?`;
        params.push(category);
      }

      sql += ` ORDER BY sort_order ASC, created_at DESC`;

      faqs = await query(sql, params) as any[];
    } catch (dbError) {
      console.error('FAQ DB error:', dbError);
      // 테이블이 없거나 스키마 문제인 경우 빈 배열 반환
      faqs = [];
    }

    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error('FAQ fetch error:', error);
    return NextResponse.json({ success: true, faqs: [] });
  }
}

export const dynamic = 'force-dynamic';