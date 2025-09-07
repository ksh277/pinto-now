'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WoodPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/wood');
  }, [router]);

  return null;
}