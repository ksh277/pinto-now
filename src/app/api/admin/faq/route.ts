import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

// GET /api/admin/faq - FAQ 목록 조회 (관리자)
export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    let faqs = [];
    try {
      faqs = await query(
        `SELECT id, category, question, answer, is_public, sort_order, created_at, updated_at
         FROM faqs
         ORDER BY sort_order ASC, created_at DESC`
      ) as any[];
    } catch (dbError) {
      console.error('Admin FAQ DB error:', dbError);
      // 테이블이 없으면 빈 배열 반환
      faqs = [];
    }

    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error('FAQ fetch error:', error);
    return NextResponse.json({ success: true, faqs: [] });
  }
}

// POST /api/admin/faq - FAQ 추가 (관리자)
export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { category, question, answer, is_public = true, sort_order = 0 } = await request.json();

    if (!category || !question || !answer) {
      return NextResponse.json({ error: '카테고리, 질문, 답변은 필수입니다.' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO faqs (category, question, answer, is_public, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [category, question, answer, is_public, sort_order]
    ) as any;

    return NextResponse.json({
      success: true,
      message: 'FAQ가 추가되었습니다.',
      faqId: result.insertId
    });
  } catch (error) {
    console.error('FAQ create error:', error);
    return NextResponse.json({ error: 'FAQ 추가 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// PUT /api/admin/faq - FAQ 수정 (관리자)
export async function PUT(request: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, category, question, answer, is_public, sort_order } = await request.json();

    if (!id || !category || !question || !answer) {
      return NextResponse.json({ error: 'ID, 카테고리, 질문, 답변은 필수입니다.' }, { status: 400 });
    }

    await query(
      `UPDATE faqs
       SET category = ?, question = ?, answer = ?, is_public = ?, sort_order = ?, updated_at = NOW()
       WHERE id = ?`,
      [category, question, answer, is_public, sort_order, id]
    );

    return NextResponse.json({
      success: true,
      message: 'FAQ가 수정되었습니다.'
    });
  } catch (error) {
    console.error('FAQ update error:', error);
    return NextResponse.json({ error: 'FAQ 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// DELETE /api/admin/faq - FAQ 삭제 (관리자)
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(request);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'FAQ ID가 필요합니다.' }, { status: 400 });
    }

    await query('DELETE FROM faqs WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'FAQ가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('FAQ delete error:', error);
    return NextResponse.json({ error: 'FAQ 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';