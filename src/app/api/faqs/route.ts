import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const sql = `
      SELECT id, question, answer, category, is_open, order_no, created_at, updated_at
      FROM faq
      ORDER BY order_no ASC, created_at DESC
    `;

    const items = await query(sql) as any[];

    const faqs = items.map(item => ({
      id: item.id.toString(),
      question: item.question,
      answer: item.answer || '',
      category: item.category,
      isPublished: item.is_open === 1,
      order: item.order_no || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    // 데이터베이스에서 가져온 데이터가 있으면 사용, 없으면 fallback 데이터
    const finalFaqs = faqs.length > 0 ? faqs : [
      {
        id: '1',
        question: '결제 수단은 무엇을 지원하나요?',
        answer: '신용카드, 계좌이체, 무통장입금을 지원합니다.',
        category: '주문/결제',
        isPublished: true,
        order: 1
      },
      {
        id: '2',
        question: '제작/배송 기간은 얼마나 걸리나요?',
        answer: '일반적으로 제작 3-5일, 배송 1-2일 소요됩니다.',
        category: '배송',
        isPublished: true,
        order: 2
      },
      {
        id: '3',
        question: '최소 주문 수량이 있나요?',
        answer: '대부분의 상품은 최소 10개부터 주문 가능합니다.',
        category: '주문',
        isPublished: true,
        order: 3
      },
      {
        id: '4',
        question: '아크릴 상품의 두께는 어떻게 되나요?',
        answer: '일반 아크릴은 3T, 스마트톡은 4-5T, 코롯토는 8-10T입니다.',
        category: '상품',
        isPublished: true,
        order: 4
      },
      {
        id: '5',
        question: '디자인 수정은 몇 번까지 가능한가요?',
        answer: '디자인 확정 전까지 무제한 수정 가능합니다.',
        category: '디자인',
        isPublished: true,
        order: 5
      }
    ];

    return NextResponse.json({ faqs: finalFaqs }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('FAQ API error:', error);
    // 에러 발생 시 fallback 데이터
    return NextResponse.json({
      faqs: [
        {
          id: '1',
          question: '결제 수단은 무엇을 지원하나요?',
          answer: '신용카드, 계좌이체, 무통장입금을 지원합니다.',
          category: '주문/결제',
          isPublished: true,
          order: 1
        },
        {
          id: '2',
          question: '제작/배송 기간은 얼마나 걸리나요?',
          answer: '일반적으로 제작 3-5일, 배송 1-2일 소요됩니다.',
          category: '배송',
          isPublished: true,
          order: 2
        },
        {
          id: '3',
          question: '최소 주문 수량이 있나요?',
          answer: '대부분의 상품은 최소 10개부터 주문 가능합니다.',
          category: '주문',
          isPublished: true,
          order: 3
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const sql = `
      INSERT INTO faq (question, answer, category, is_open, order_no)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      data.question,
      data.answer || '',
      data.category || '일반',
      data.isPublished ? 1 : 0,
      data.order || 0
    ]) as any;

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: 'FAQ가 성공적으로 생성되었습니다.'
    }, {
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'FAQ 생성에 실패했습니다.' }, { status: 500 });
  }
}
