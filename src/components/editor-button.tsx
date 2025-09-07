'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export function EditorButton() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Link href="/editor">
        <Button size="lg" className="rounded-full shadow-lg">
          <Palette className="mr-2" />
          에디터
        </Button>
      </Link>
    </div>
  );
}