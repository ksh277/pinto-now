'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    async function fetchCategoryShortcuts() {
      try {
        const response = await fetch('/api/category-shortcuts');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.slice(0, 12)); // 최대 12개만 표시
        }
      } catch (error) {
        console.error('Failed to fetch category shortcuts:', error);
      }
    }

    fetchCategoryShortcuts();
  }, []);

  return (
    <div className="hidden md:flex justify-center w-full overflow-x-auto">
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
            style={{ width: '100px' }} // 전체 너비를 100px로 줄임
          >
            <div 
              className="relative flex items-center justify-center rounded-full bg-white transition-shadow group-hover:shadow-lg dark:bg-secondary overflow-hidden mb-2"
              style={{ 
                width: '80px',  // 원형 크기를 80px로 줄임 (160px → 80px)
                height: '80px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Image
                src={category.image_url}
                alt={category.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <span 
              className="font-medium text-foreground group-hover:text-primary text-center leading-tight"
              style={{ 
                fontSize: '12px', // 폰트 크기도 줄임
                maxWidth: '100px',
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
