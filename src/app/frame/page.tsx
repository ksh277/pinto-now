'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FramePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/frame');
  }, [router]);

  return null;
}