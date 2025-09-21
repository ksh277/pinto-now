
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaqForm } from '../../faq-form';
import type { FAQ } from '@/lib/types';

export default function EditFaqPage() {
  const params = useParams();
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await fetch('/api/admin/faq');
        if (response.ok) {
          const data = await response.json();
          const targetFaq = data.faqs.find((f: any) => f.id.toString() === params?.id);
          if (targetFaq) {
            setFaq({
              id: targetFaq.id.toString(),
              question: targetFaq.question,
              category: targetFaq.category,
              answer: targetFaq.answer,
              isPublished: targetFaq.is_public,
              order: targetFaq.sort_order,
              createdAt: new Date(targetFaq.created_at),
              updatedAt: new Date(targetFaq.updated_at)
            });
          }
        }
      } catch (error) {
        console.error('FAQ 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchFaq();
    }
  }, [params?.id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!faq) {
    return <div className="container mx-auto px-4 py-8 text-center">FAQ를 찾을 수 없습니다.</div>;
  }

  return <FaqForm faq={faq} />;
}
