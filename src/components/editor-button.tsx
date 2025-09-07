'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export function EditorButton() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Link href="/editor">
        <Button 
          size="lg" 
          className="rounded-full shadow-lg md:px-6 md:py-3 w-12 h-12 md:w-auto md:h-auto p-0 md:p-3"
        >
          <Palette className="md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">에디터</span>
        </Button>
      </Link>
    </div>
  );
}