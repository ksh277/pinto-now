'use client';

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
  // 구글 클라우드 스토리지에 업로드된 카테고리 이미지 사용
  const categories: ShortcutCategory[] = [
    { id: '1', title: '아크릴 굿즈', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413953162-1.png', href: '/category/acrylic', sort_order: 1, is_active: true },
    { id: '2', title: '포토카드', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413956225-2.png', href: '/category/photocard', sort_order: 2, is_active: true },
    { id: '3', title: '티셔츠 인쇄', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413957789-3.png', href: '/category/tshirt', sort_order: 3, is_active: true },
    { id: '4', title: '컵 만들기', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413960744-4.png', href: '/category/cup', sort_order: 4, is_active: true },
    { id: '5', title: '다꾸 만들기', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413962976-5.png', href: '/category/diary', sort_order: 5, is_active: true },
    { id: '6', title: '반려동물 굿즈', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413964567-6.png', href: '/category/pet', sort_order: 6, is_active: true },
    { id: '7', title: '단체 판촉물', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413966128-7.png', href: '/category/promotion', sort_order: 7, is_active: true },
    { id: '8', title: '광고, 사인물', image_url: 'https://storage.googleapis.com/pinto-images-bucket/banners/1757413967653-8.png', href: '/category/sign', sort_order: 8, is_active: true }
  ];

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
