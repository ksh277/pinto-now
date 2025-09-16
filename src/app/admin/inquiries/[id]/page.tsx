
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send } from 'lucide-react';

interface Inquiry {
  id: string;
  title: string;
  user: { nickname: string };
  type: string;
  status: string;
  createdAt: string;
  content: string;
  answer?: string;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    received: 'destructive',
    in_progress: 'secondary',
    answered: 'default',
    closed: 'outline'
}

const statusText: Record<string, string> = {
    received: '접수',
    in_progress: '처리중',
    answered: '답변완료',
    closed: '종료'
}

export default function AdminInquiryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInquiry();
  }, [params.id]);

  const fetchInquiry = async () => {
    try {
      const response = await fetch(`/api/admin/inquiries/${params.id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setInquiry(data.inquiry);
        setAnswer(data.inquiry.answer || '');
      } else {
        console.error('Failed to fetch inquiry');
      }
    } catch (error) {
      console.error('Error fetching inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          answer: answer.trim(),
          status: 'answered'
        })
      });

      if (response.ok) {
        alert('답변이 등록되었습니다.');
        fetchInquiry(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || '답변 등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (response.ok) {
        alert('상태가 변경되었습니다.');
        fetchInquiry();
      } else {
        const error = await response.json();
        alert(error.error || '상태 변경 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-8">로딩 중...</div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-8">문의를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        목록으로
      </Button>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <Badge variant={statusVariant[inquiry.status] || 'default'}>
                  {statusText[inquiry.status] || inquiry.status}
                </Badge>
                <div className="flex gap-2">
                  {inquiry.status !== 'in_progress' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus('in_progress')}>
                      처리중으로 변경
                    </Button>
                  )}
                  {inquiry.status !== 'closed' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus('closed')}>
                      종료
                    </Button>
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl mb-2">{inquiry.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                <p>작성자: {inquiry.user.nickname}</p>
                <p>문의 유형: {inquiry.type}</p>
                <p>접수일: {new Date(inquiry.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">문의 내용</h4>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {inquiry.content}
              </div>
            </div>

            {inquiry.answer && (
              <div>
                <h4 className="font-semibold mb-3">답변 내용</h4>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 whitespace-pre-wrap">
                  {inquiry.answer}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 p-6 border-t">
          <form onSubmit={handleSubmitAnswer} className="w-full">
            <div className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium mb-2">
                  {inquiry.answer ? '답변 수정' : '답변 작성'}
                </label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="고객에게 전달할 답변을 작성해주세요..."
                  rows={5}
                  disabled={submitting}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting || !answer.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? '등록 중...' : inquiry.answer ? '답변 수정' : '답변 등록'}
                </Button>
              </div>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
