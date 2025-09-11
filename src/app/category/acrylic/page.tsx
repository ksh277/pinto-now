'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AcrylicCategoryPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to akril-goods page
    router.replace('/akril-goods');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">아크릴 굿즈 페이지로 이동 중...</p>
      </div>
    </div>
  );
}