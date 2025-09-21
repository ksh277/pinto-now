
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type FAQ = {
  id: string;
  question: string;
  category: string;
  isPublished: boolean;
  order: number;
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/admin/faq');
      if (response.ok) {
        const data = await response.json();
        const formattedFaqs = data.faqs?.map((faq: any) => ({
          id: faq.id.toString(),
          question: faq.question,
          category: faq.category,
          isPublished: faq.is_public,
          order: faq.sort_order
        })) || [];
        setFaqs(formattedFaqs);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      // Fallback to mock data
      setFaqs([
        { id: '1', question: '결제 수단은 무엇을 지원하나요?', category: '주문/결제', isPublished: true, order: 1 },
        { id: '2', question: '제작/배송 기간은 얼마나 걸리나요?', category: '배송', isPublished: true, order: 2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/faq?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchFaqs();
        alert('FAQ가 삭제되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || 'FAQ 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      alert('FAQ 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">FAQ 관리</h1>
        <Button asChild>
          <Link href="/admin/faq/new">새 FAQ 작성</Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>질문</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>순서</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading FAQs...
                </TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No FAQs found. <Link href="/admin/faq/new" className="underline">Create your first FAQ</Link>
                </TableCell>
              </TableRow>
            ) : (
              faqs.map(faq => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.question}</TableCell>
                  <TableCell>{faq.category}</TableCell>
                  <TableCell>{faq.isPublished ? '게시' : '숨김'}</TableCell>
                  <TableCell>{faq.order}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/faq/edit/${faq.id}`}>수정</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">삭제</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                          <AlertDialogDescription>
                             이 작업은 되돌릴 수 없으며 FAQ 항목이 영구적으로 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteFaq(faq.id)}>삭제</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
