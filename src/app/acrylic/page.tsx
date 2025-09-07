'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AcrylicPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/acrylic');
  }, [router]);

  return null;
}