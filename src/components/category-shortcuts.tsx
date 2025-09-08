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
    <div className="hidden md:flex justify-center w-full">
      <div 
        className="flex flex-wrap justify-center items-start"
        style={{ 
          columnGap: '55px', // 가로 간격 정확히 55px
          rowGap: '32px',    // 세로 간격 32px
          maxWidth: '1200px' // 최대 너비 제한
        }}
      >
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.id}
            className="group flex flex-col items-center text-center"
            style={{ width: '160px' }}
          >
            <div 
              className="relative flex items-center justify-center rounded-full bg-white transition-shadow group-hover:shadow-lg dark:bg-secondary overflow-hidden mb-3"
              style={{ 
                width: '160px', 
                height: '160px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Image
                src={category.image_url}
                alt={category.title}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <span 
              className="font-medium text-foreground group-hover:text-primary text-center leading-tight"
              style={{ 
                fontSize: '14px',
                maxWidth: '160px',
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
