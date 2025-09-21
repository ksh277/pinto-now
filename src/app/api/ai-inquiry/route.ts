import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// POST /api/ai-inquiry - AI 기반 문의 답변
export async function POST(request: NextRequest) {
  try {
    const { question, category } = await request.json();

    if (!question) {
      return NextResponse.json({ error: '질문을 입력해주세요.' }, { status: 400 });
    }

    // 1. FAQ에서 유사한 질문 검색
    let faqs = [];
    try {
      let sql = `SELECT id, category, question, answer
                 FROM faqs
                 WHERE is_public = 1`;
      const params: any[] = [];

      if (category) {
        sql += ` AND category = ?`;
        params.push(category);
      }

      sql += ` ORDER BY sort_order ASC`;

      faqs = await query(sql, params) as any[];
    } catch (dbError) {
      console.error('AI inquiry FAQ DB error:', dbError);
      faqs = [];
    }

    // 2. 간단한 키워드 매칭으로 관련 FAQ 찾기
    const questionLower = question.toLowerCase();
    const relevantFaqs = faqs.filter((faq: any) => {
      const faqQuestionLower = faq.question.toLowerCase();
      const faqAnswerLower = faq.answer.toLowerCase();

      // 간단한 키워드 매칭
      return faqQuestionLower.includes(questionLower) ||
             questionLower.includes(faqQuestionLower) ||
             faqAnswerLower.includes(questionLower);
    });

    if (relevantFaqs.length > 0) {
      // 관련 FAQ가 있으면 반환
      return NextResponse.json({
        success: true,
        type: 'faq_match',
        answer: relevantFaqs[0].answer,
        relatedFaqs: relevantFaqs.slice(0, 3),
        suggestion: '위 답변이 도움이 되지 않으면 1:1 문의를 이용해주세요.'
      });
    }

    // 3. FAQ에서 답변을 찾을 수 없는 경우
    const commonAnswers: Record<string, string> = {
      '주문': '주문은 상품 페이지에서 옵션을 선택하신 후 "장바구니에 담기" 또는 "바로 주문하기"를 클릭하여 진행하실 수 있습니다. 자세한 주문 방법은 1:1 문의를 이용해주세요.',
      '배송': '배송은 주문 완료 후 3-7 영업일 소요됩니다. 배송 현황은 마이페이지에서 확인 가능합니다. 배송 관련 문의는 1:1 문의를 이용해주세요.',
      '결제': '신용카드, 계좌이체, 카카오페이, 네이버페이를 지원합니다. 결제 관련 문제가 있으시면 1:1 문의를 이용해주세요.',
      '취소': '주문 취소는 제작 시작 전까지 가능합니다. 마이페이지에서 주문 취소를 신청하거나 1:1 문의를 이용해주세요.',
      '환불': '환불은 주문 취소 후 영업일 기준 3-5일 내에 처리됩니다. 환불 관련 문의는 1:1 문의를 이용해주세요.',
      '디자인': '디자인 파일은 PDF, AI, PSD 형식으로 업로드 가능합니다. 디자인 관련 문의는 1:1 문의를 이용해주세요.',
      '가격': '상품 가격은 사이즈, 수량, 옵션에 따라 달라집니다. 정확한 견적은 상품 페이지에서 옵션 선택 후 확인 가능합니다.'
    };

    // 키워드 기반 일반 답변
    for (const [keyword, answer] of Object.entries(commonAnswers)) {
      if (questionLower.includes(keyword.toLowerCase())) {
        return NextResponse.json({
          success: true,
          type: 'general_answer',
          answer: answer,
          suggestion: '더 자세한 문의는 1:1 문의를 이용해주세요.'
        });
      }
    }

    // 4. 일반적인 답변
    return NextResponse.json({
      success: true,
      type: 'default_answer',
      answer: '죄송합니다. 해당 질문에 대한 정확한 답변을 찾을 수 없습니다. 보다 정확한 답변을 위해 1:1 문의를 이용해주시기 바랍니다.',
      suggestion: '1:1 문의를 통해 전문 상담원이 더 자세한 답변을 드리겠습니다.'
    });

  } catch (error) {
    console.error('AI inquiry error:', error);
    return NextResponse.json({
      error: 'AI 문의 처리 중 오류가 발생했습니다.',
      suggestion: '1:1 문의를 이용해주세요.'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';