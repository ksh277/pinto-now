import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

interface Params { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;

    const sql = `
      SELECT id, question, answer, category, is_open, order_no, created_at, updated_at
      FROM faq
      WHERE id = ?
    `;

    const items = await query(sql, [id]) as any[];

    if (items.length === 0) {
      return NextResponse.json({ error: 'FAQ를 찾을 수 없습니다.' }, { status: 404 });
    }

    const item = items[0];
    const faq = {
      id: item.id.toString(),
      question: item.question,
      answer: item.answer || '',
      category: item.category,
      isPublished: item.is_open === 1,
      order: item.order_no || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    };

    return NextResponse.json(faq, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: 'FAQ 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = await req.json();

    const sql = `
      UPDATE faq SET
        question = ?,
        answer = ?,
        category = ?,
        is_open = ?,
        order_no = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await query(sql, [
      data.question,
      data.answer || '',
      data.category || '일반',
      data.isPublished ? 1 : 0,
      data.order || 0,
      id
    ]);

    return NextResponse.json({
      success: true,
      message: 'FAQ가 성공적으로 수정되었습니다.'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'FAQ 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;

    const sql = `DELETE FROM faq WHERE id = ?`;
    await query(sql, [id]);

    return NextResponse.json({
      success: true,
      message: 'FAQ가 성공적으로 삭제되었습니다.'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'FAQ 삭제에 실패했습니다.' }, { status: 500 });
  }
}
