
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
  const [categories, setCategories] = useState<ShortcutCategory[]>([]);

  useEffect(() => {
    async function fetchCategoryShortcuts() {
      try {
        const response = await fetch('/api/category-shortcuts');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          // 폴백 데이터 사용
          setCategories([
            { id: '1', href: '/category/1인샵', label: '1인샵', imgSrc: 'https://placehold.co/100x100.png' },
            { id: '2', href: '/category/선물추천', label: '선물추천', imgSrc: 'https://placehold.co/100x100.png' },
            { id: '3', href: '/category/겨울아이디어', label: '겨울아이디어', imgSrc: 'https://placehold.co/100x100.png' },
            { id: '4', href: '/category/여행굿즈', label: '여행 굿즈', imgSrc: 'https://placehold.co/100x100.png' },
            { id: '5', href: '/category/문구미니', label: '문구/미니', imgSrc: 'https://placehold.co/100x100.png' },
            { id: '6', href: '/category/반려동물굿즈', label: '반려동물 굿즈', imgSrc: 'https://placehold.co/100x100.png' },
            { id: '7', href: '/category/의류', label: '의류', imgSrc: 'https://placehold.co/100x100.png' },
            { id: '8', href: '/category/개성아이디어', label: '개성 아이디어', imgSrc: 'https://placehold.co/100x100.png' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch category shortcuts:', error);
        // 에러 시 폴백 데이터 사용
        setCategories([
          { id: '1', href: '/category/1인샵', label: '1인샵', imgSrc: 'https://placehold.co/100x100.png' },
          { id: '2', href: '/category/선물추천', label: '선물추천', imgSrc: 'https://placehold.co/100x100.png' },
          { id: '3', href: '/category/겨울아이디어', label: '겨울아이디어', imgSrc: 'https://placehold.co/100x100.png' },
          { id: '4', href: '/category/여행굿즈', label: '여행 굿즈', imgSrc: 'https://placehold.co/100x100.png' },
          { id: '5', href: '/category/문구미니', label: '문구/미니', imgSrc: 'https://placehold.co/100x100.png' },
          { id: '6', href: '/category/반려동물굿즈', label: '반려동물 굿즈', imgSrc: 'https://placehold.co/100x100.png' },
          { id: '7', href: '/category/의류', label: '의류', imgSrc: 'https://placehold.co/100x100.png' },
          { id: '8', href: '/category/개성아이디어', label: '개성 아이디어', imgSrc: 'https://placehold.co/100x100.png' },
        ]);
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
