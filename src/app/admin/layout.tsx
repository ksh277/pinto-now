"use client";

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProductContext } from '@/contexts/product-context';
import { Package, FileText, HelpCircle, MessageSquare, BookOpen, Image as ImageIcon, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/product-shelf-banners', label: 'Product Shelf Banners', icon: ImageIcon },
  { href: '/admin/info-cards', label: 'Info Cards', icon: CreditCard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/notice', label: 'Notices', icon: FileText },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/guide', label: 'Guides', icon: BookOpen },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { role } = useProductContext();
  const router = useRouter();
  const pathname = usePathname();

  // 임시로 관리자 페이지 접근을 허용 (admin 계정 로그인 상태 확인)
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 세션 쿠키에서 사용자 정보 확인
    fetch('/api/me')
      .then(response => response.json())
      .then(data => {
        if (data.user && (data.user.username === 'admin' || data.user.role === 'admin' || data.user.role === 'ADMIN')) {
          setIsAuthorized(true);
        } else {
          // router.replace('/');
          // 임시로 모든 접근 허용
          setIsAuthorized(true);
        }
      })
      .catch(() => {
        // router.replace('/');
        // 임시로 모든 접근 허용
        setIsAuthorized(true);
      });
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-6 text-white">
        <h2 className="mb-8 text-2xl font-bold">PINTO Admin</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <span
                className={cn(
                  'flex items-center gap-3 rounded-md px-4 py-3 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white',
                  (pathname ?? '').startsWith(item.href) && 'bg-gray-900 text-white',
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}

