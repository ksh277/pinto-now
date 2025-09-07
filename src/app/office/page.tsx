'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OfficePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/office');
  }, [router]);

  return null;
}