
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus, Image as ImageIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function MyInquiriesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newInquiry, setNewInquiry] = useState({ title: '', content: '' });
  const [inquiryType, setInquiryType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
    if (isAuthenticated) {
      fetchInquiries();
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiry.title.trim() || !newInquiry.content.trim() || !inquiryType) {
        alert('문의 유형, 제목, 내용을 모두 입력해주세요.');
        return;
    }
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: inquiryType,
          title: newInquiry.title,
          content: newInquiry.content
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setShowForm(false);
        setNewInquiry({ title: '', content: '' });
        setInquiryType('');
        fetchInquiries();
      } else {
        alert(result.error || '문의 등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (isLoading || !isAuthenticated) {
      return (
          <div className="flex h-screen items-center justify-center">
            <p>Redirecting...</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">1:1 문의</h1>
        <Button onClick={() => setShowForm(s => !s)}>
          <Plus className="mr-2 h-4 w-4" />
          문의 등록하기
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>새 문의 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInquirySubmit} className="space-y-6">
               <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <p>- 이미지 첨부는 최대 6개(각 10MB 이하)까지 가능합니다.</p>
                <p>- 주문 관련 문의는 주문번호를 함께 적어 주세요.</p>
              </div>

               <div>
                 <Label htmlFor="inquiryType">문의 유형</Label>
                  <Select onValueChange={setInquiryType} value={inquiryType}>
                    <SelectTrigger id="inquiryType"><SelectValue placeholder="문의 유형을 선택하세요" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">주문/결제</SelectItem>
                      <SelectItem value="shipping">배송</SelectItem>
                      <SelectItem value="product">상품</SelectItem>
                      <SelectItem value="etc">기타</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
                <div>
                 <Label htmlFor="inquiryTitle">제목</Label>
                  <Input 
                    id="inquiryTitle"
                    placeholder="제목을 입력하세요."
                    value={newInquiry.title}
                    onChange={(e) => setNewInquiry(p => ({...p, title: e.target.value}))}
                  />
                </div>
              
              <Textarea
                placeholder="문의하실 내용을 자세하게 적어주세요."
                value={newInquiry.content}
                onChange={(e) => setNewInquiry(p => ({...p, content: e.target.value}))}
                rows={8}
              />
              
              <div className="mb-4">
                <Label className="block text-sm font-medium text-muted-foreground mb-2">
                  첨부파일 (최대 6개)
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted p-6">
                   <ImageIcon className="h-8 w-8 text-muted-foreground" />
                   <p className="text-sm text-muted-foreground mt-2">파일을 드래그하거나 클릭해서 업로드</p>
                   <Input type="file" accept="image/*" multiple className="hidden" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                 <Button type="button" variant="ghost" onClick={() => setShowForm(false)} disabled={submitting}>
                    취소
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? '등록 중...' : '문의 등록'}
                  </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

       <div className="border-t">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>로딩 중...</p>
          </div>
        ) : inquiries.length > 0 ? inquiries.map((inquiry) => (
          <Link href={`/mypage/inquiries/${inquiry.id}`} key={inquiry.id} className="group block border-b">
              <div className="flex items-center justify-between py-4">
                  <div className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-medium group-hover:text-primary truncate">{inquiry.title}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                     <span className={`text-xs px-2 py-1 rounded-full ${inquiry.status === 'answered' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {inquiry.status === 'answered' ? '답변완료' : '접수'}
                     </span>
                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
              </div>
          </Link>
        )) : (
            <div className="text-center py-16 text-muted-foreground">
                <p>작성한 문의 내역이 없습니다.</p>
            </div>
        )}
      </div>
    </div>
  );
}
