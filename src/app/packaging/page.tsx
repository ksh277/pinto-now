'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/packaging');
  }, [router]);

  return null;
}