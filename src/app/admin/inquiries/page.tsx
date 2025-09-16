
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

interface Inquiry {
  id: string;
  title: string;
  user: { nickname: string };
  type: string;
  status: string;
  createdAt: string;
  content?: string;
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

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/inquiries', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
        setError('');
      } else {
        setError('문의 내역을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">1:1 문의 관리</h1>
        <Button onClick={fetchInquiries} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>유형</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>문의일</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  등록된 문의가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map(inquiry => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium max-w-md truncate">{inquiry.title}</TableCell>
                  <TableCell>{inquiry.user.nickname}</TableCell>
                  <TableCell>{inquiry.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[inquiry.status] || 'default'}>
                      {statusText[inquiry.status] || inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/inquiries/${inquiry.id}`}>답변하기</Link>
                    </Button>
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
