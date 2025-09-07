'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StickerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/sticker');
  }, [router]);

  return null;
}