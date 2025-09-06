'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // /editor 페이지에서는 Header를 숨김
  if (pathname === '/editor') {
    return null;
  }
  
  return <Header />;
}