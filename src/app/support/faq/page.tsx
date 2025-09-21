
'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MessageCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FAQ } from '@/lib/types';

type AIResponse = {
  success: boolean;
  type: 'faq_match' | 'general_answer' | 'default_answer';
  answer: string;
  relatedFaqs?: FAQ[];
  suggestion: string;
};

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState(['전체']);
  const [loading, setLoading] = useState(true);

  // AI Inquiry states
  const [showAIInquiry, setShowAIInquiry] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faq');
      if (response.ok) {
        const data = await response.json();
        const formattedFaqs = data.faqs.map((faq: any) => ({
          id: faq.id.toString(),
          question: faq.question,
          category: faq.category,
          answer: faq.answer,
          isPublished: true,
          order: faq.sort_order,
          createdAt: new Date(faq.created_at),
          updatedAt: new Date(faq.updated_at)
        }));
        setFaqs(formattedFaqs);

        // Extract unique categories
        const uniqueCategories = ['전체', ...Array.from(new Set(formattedFaqs.map((f: FAQ) => f.category)))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('FAQ 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIInquiry = async () => {
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          category: activeCategory !== '전체' ? activeCategory : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data);
      } else {
        setAiResponse({
          success: false,
          type: 'default_answer',
          answer: 'AI 문의 처리 중 오류가 발생했습니다.',
          suggestion: '1:1 문의를 이용해주세요.'
        });
      }
    } catch (error) {
      console.error('AI 문의 오류:', error);
      setAiResponse({
        success: false,
        type: 'default_answer',
        answer: 'AI 문의 처리 중 오류가 발생했습니다.',
        suggestion: '1:1 문의를 이용해주세요.'
      });
    } finally {
      setAiLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const categoryMatch = activeCategory === '전체' || faq.category === activeCategory;
    const searchMatch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">자주 묻는 질문</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          궁금한 점을 빠르고 쉽게 해결하세요.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="궁금한 점을 검색해보세요..."
            className="w-full rounded-full bg-background py-2 pl-10 pr-4 text-base h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* AI 문의 기능 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            AI 문의하기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="궁금한 점을 물어보세요..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAIInquiry} disabled={aiLoading || !aiQuestion.trim()}>
                {aiLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {aiResponse && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">AI 답변</h4>
                <p className="mb-2">{aiResponse.answer}</p>
                <p className="text-sm text-muted-foreground">{aiResponse.suggestion}</p>

                {aiResponse.relatedFaqs && aiResponse.relatedFaqs.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">관련 FAQ</h5>
                    <ul className="space-y-1">
                      {aiResponse.relatedFaqs.map((faq, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">Q.</span> {faq.question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 flex justify-center border-b">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className={cn(
              'rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-muted-foreground hover:text-primary',
              activeCategory === category && 'border-primary font-semibold text-primary'
            )}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <p>FAQ를 불러오는 중...</p>
          </div>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b">
              <AccordionTrigger className="py-4 text-left text-base hover:no-underline">
                <span className="font-semibold text-primary mr-4">Q.</span>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="bg-secondary/50 p-6 rounded-md">
                <div className="flex">
                  <span className="font-semibold text-muted-foreground mr-4">A.</span>
                  <p className="text-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </Accordion>
      <h2 className="text-xl font-semibold mt-8">굿즈 에디터 FAQ</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>자동 보드: 업로드 이미지 외곽에서 +15mm 확장, 절제선은 추가 +8mm를 기본으로 합니다.</li>
        <li>키링 홀: 캔버스의 흰색 원을 드래그하면 보드 둘레에 스냅됩니다. 원하는 위치로 이동하세요.</li>
        <li>템플릿 모드: 사각/원/오각/육각 판을 선택 후 이미지를 올려 배치합니다.</li>
        <li>저장: PNG/SVG/PDF 내보내기, 또는 DB에 저장(미리보기 PNG와 설계 JSON 포함)합니다.</li>
      </ul>
    </div>
  );
}

export const dynamic = 'force-dynamic';
