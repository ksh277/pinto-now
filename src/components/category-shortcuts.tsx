'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ShortcutCategory {
  id: string;
  title: string;
  image_url: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

export function CategoryShortcuts() {
  const [categories, setCategories] = useState<ShortcutCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category-shortcuts');
        if (response.ok) {
          const data = await response.json();
          // 활성화된 카테고리만 필터링하고 정렬
          const activeCategories = data
            .filter((cat: ShortcutCategory) => cat.is_active)
            .sort((a: ShortcutCategory, b: ShortcutCategory) => a.sort_order - b.sort_order);
          setCategories(activeCategories);
        }
      } catch (error) {
        // 에러 시 기본 데이터 사용
        setCategories([
          { id: '1', title: '아크릴 굿즈', image_url: '/category/1.png', href: '/acrylic', sort_order: 1, is_active: true },
          { id: '2', title: '포토카드', image_url: '/category/2.png', href: '/category/photocard', sort_order: 2, is_active: true },
          { id: '3', title: '티셔츠 인쇄', image_url: '/category/3.png', href: '/category/tshirt', sort_order: 3, is_active: true },
          { id: '4', title: '컵 만들기', image_url: '/category/4.png', href: '/category/cup', sort_order: 4, is_active: true },
          { id: '5', title: '다꾸 만들기', image_url: '/category/5.png', href: '/category/diary', sort_order: 5, is_active: true },
          { id: '6', title: '반려동물 굿즈', image_url: '/category/6.png', href: '/category/pet', sort_order: 6, is_active: true },
          { id: '7', title: '단체 판촉물', image_url: '/category/7.png', href: '/category/promotion', sort_order: 7, is_active: true },
          { id: '8', title: '광고, 사인물', image_url: '/category/8.png', href: '/category/sign', sort_order: 8, is_active: true }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 로딩 중이거나 카테고리가 없으면 숨김
  if (isLoading || categories.length === 0) {
    return null;
  }

  return (
    <div className="hidden md:flex justify-center w-full">
      <div 
        className="flex justify-center items-start flex-nowrap"
        style={{ 
          gap: '30px', // 간격을 30px로 줄임
          minWidth: 'fit-content'
        }}
      >
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.id}
            className="group flex flex-col items-center text-center flex-shrink-0"
            style={{ width: '156px' }}
          >
            <div 
              className="relative flex items-center justify-center rounded-full bg-white transition-shadow group-hover:shadow-lg dark:bg-secondary overflow-hidden mb-2"
              style={{ 
                width: '156px',
                height: '156px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Image
                src={category.image_url}
                alt={category.title}
                fill
                className="object-cover"
                sizes="156px"
              />
            </div>
            <span 
              className="font-medium text-foreground group-hover:text-primary text-center leading-tight"
              style={{ 
                fontSize: '14px',
                maxWidth: '156px',
                wordBreak: 'keep-all',
                lineHeight: '1.2'
              }}
            >
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
