'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ShortcutCategory {
    id: string;
    href: string;
    label: string;
    imgSrc: string;
}

export function CategoryShortcuts() {
  const [categories, setCategories] = useState<ShortcutCategory[]>([
    // 기본 데이터를 먼저 설정해서 즉시 보이도록
    { id: '1', href: '/category/1만원이하굿즈', label: '1만원 이하 굿즈', imgSrc: 'https://placehold.co/100x100/FFB6C1/333?text=💰' },
    { id: '2', href: '/category/야구굿즈', label: '야구 굿즈', imgSrc: 'https://placehold.co/100x100/87CEEB/333?text=⚾' },
    { id: '3', href: '/category/여행굿즈', label: '여행 굿즈', imgSrc: 'https://placehold.co/100x100/98FB98/333?text=✈️' },
    { id: '4', href: '/category/팬굿즈', label: '팬 굿즈', imgSrc: 'https://placehold.co/100x100/DDA0DD/333?text=💜' },
    { id: '5', href: '/category/폰꾸미기', label: '폰꾸미기', imgSrc: 'https://placehold.co/100x100/FFE4B5/333?text=📱' },
    { id: '6', href: '/category/반려동물굿즈', label: '반려동물 굿즈', imgSrc: 'https://placehold.co/100x100/F0E68C/333?text=🐾' },
    { id: '7', href: '/category/선물추천', label: '선물 추천', imgSrc: 'https://placehold.co/100x100/F5DEB3/333?text=🎁' },
    { id: '8', href: '/category/커스텀아이디어', label: '커스텀 아이디어', imgSrc: 'https://placehold.co/100x100/E6E6FA/333?text=💡' },
  ]);

  useEffect(() => {
    async function fetchCategoryShortcuts() {
      try {
        const response = await fetch('/api/category-shortcuts');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
        // API가 실패해도 기본 데이터가 이미 있으므로 그대로 둠
      } catch (error) {
        console.error('Failed to fetch category shortcuts:', error);
        // 기본 데이터가 이미 설정되어 있으므로 추가 처리 불필요
      }
    }

    fetchCategoryShortcuts();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 place-items-center gap-y-6 gap-x-4 w-full px-2 md:px-8">
      {categories.map((category) => (
        <Link
          href={category.href}
          key={category.id}
          className="group flex flex-col items-center gap-3 text-center w-full max-w-[120px]"
        >
          <div className="relative flex w-full aspect-square max-w-[72px] items-center justify-center rounded-full bg-white transition-shadow group-hover:shadow-md dark:bg-secondary overflow-hidden">
            <Image
              src={category.imgSrc}
              alt={category.label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 48px, 72px"
            />
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-primary md:text-sm text-center w-full truncate">
            {category.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
