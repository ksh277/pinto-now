'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LanyardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/lanyard');
  }, [router]);

  return null;
}