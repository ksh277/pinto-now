'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClothingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/clothing');
  }, [router]);

  return null;
}