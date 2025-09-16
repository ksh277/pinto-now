'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Product = {
  id: string;
  nameKo?: string;
  priceKrw?: number;
  imageUrl?: string;
  stats?: { likeCount?: number; reviewCount?: number };
};

type ProductShelfBanner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  products: Product[];
  moreLink?: string;
};

type ProductShelfCarouselProps = {
  banners: ProductShelfBanner[];
};

// 배너 ID에 따라 적절한 카테고리 페이지로 매핑
function getBannerCategoryUrl(banner: ProductShelfBanner): string {
  const title = banner.title.toLowerCase();
  const id = banner.id;

  // 배너 제목이나 ID를 기반으로 적절한 카테고리 페이지로 매핑
  if (title.includes('아크릴') || id === 's1' || id === 's2' || id === 's3') {
    return '/akril-goods'; // 모든 아크릴 관련 배너는 아크릴 굿즈 페이지로
  } else if (title.includes('티셔츠') || title.includes('t-shirt')) {
    return '/clothing-goods';
  } else if (title.includes('키링') || title.includes('keyring')) {
    return '/akril-goods'; // 키링도 아크릴 굿즈 페이지로
  } else if (title.includes('우산') || title.includes('umbrella')) {
    return '/promo-product-view'; // 우산은 단체판촉상품으로
  } else if (title.includes('스티커') || title.includes('sticker')) {
    return '/sticker-goods';
  } else if (title.includes('액자') || title.includes('frame')) {
    return '/frame-goods';
  } else if (title.includes('의류') || title.includes('clothing')) {
    return '/clothing-goods';
  } else {
    // 기본값으로 아크릴 굿즈 페이지로 (현재 주요 상품이 아크릴이므로)
    return '/akril-goods';
  }
}

export default function ProductShelfCarousel({ banners }: ProductShelfCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.5 : 400;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.5 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fmtPrice = (n?: number) =>
    typeof n === 'number' ? `${n.toLocaleString()}원` : '가격문의';

  if (banners.length <= 3) {
    return (
      <section className="py-10 md:py-14">
        <h2 className="mb-4 text-[15px] font-semibold text-slate-700">
          단체 굿즈 합리적인 가격으로 예쁘게 만들어 드릴게요.
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {banners.map(banner => (
            <ProductShelfItem key={banner.id} banner={banner} fmtPrice={fmtPrice} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14">
      <h2 className="mb-4 text-[15px] font-semibold text-slate-700">
        단체 굿즈 합리적인 가격으로 예쁘게 만들어 드릴게요.
      </h2>
      
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-4 scrollbar-hide px-4 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {banners.map(banner => (
            <div key={banner.id} className="flex-shrink-0 w-[calc(50vw-1.5rem)] md:w-[380px] snap-start">
              <ProductShelfItem banner={banner} fmtPrice={fmtPrice} />
            </div>
          ))}
        </div>
        
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-colors z-10"
          onClick={scrollLeft}
          aria-label="이전 배너"
        >
          <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-colors z-10"
          onClick={scrollRight}
          aria-label="다음 배너"
        >
          <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
        </button>
      </div>
    </section>
  );
}

function ProductShelfItem({ 
  banner, 
  fmtPrice 
}: { 
  banner: ProductShelfBanner; 
  fmtPrice: (n?: number) => string;
}) {
  const visibleProducts = banner.products.slice(0, 2);
  const hasMore = banner.products.length > 2;
  const [imageError, setImageError] = useState(false);
  
  // Fix problematic image URLs
  const getFixedImageUrl = (imageUrl: string) => {
    if (imageError || imageUrl.includes('via.placeholder.com')) {
      // Use stable fallback image
      return 'https://placehold.co/400x260/e2e8f0/64748b.png?text=Banner+Image';
    }
    return imageUrl;
  };

  return (
    <div>
      {/* 배너 이미지 (텍스트 없이) */}
      <div className="min-h-[180px] md:min-h-[260px] rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/70 relative overflow-hidden">
        <Image
          src={getFixedImageUrl(banner.imageUrl)}
          alt={banner.title}
          fill
          className="object-cover rounded-2xl"
          sizes="(max-width: 768px) 320px, 380px"
          onError={() => setImageError(true)}
        />
      </div>

      {/* 제목과 설명 텍스트 */}
      <div className="mt-4">
        <h3 className="text-[15px] font-semibold leading-6 text-gray-900 dark:text-white break-keep">
          {banner.title}
        </h3>
        <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-400 break-keep">
          {banner.description}
        </p>
      </div>

      {/* 연관 상품 목록 */}
      <div className="mt-4 space-y-4">
        {visibleProducts.map((product: Product) => (
          <div key={product.id} className="flex items-center gap-3">
            <Link href={`/products/${product.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-200 block">
              <Image
                src={product.imageUrl || 'https://placehold.co/300x300.png'}
                alt={product.nameKo || 'product'}
                fill
                sizes="64px"
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/300x300/e2e8f0/64748b.png?text=Product';
                }}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] text-slate-500">
                {product.nameKo || '상품명'}
              </p>
              <div className="mt-1 text-[13px] font-semibold text-teal-600">
                {fmtPrice(product.priceKrw)} <span className="text-teal-600/70">부터</span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                <span>♡ {product.stats?.likeCount ?? 0}</span>
                <span>리뷰 {product.stats?.reviewCount ?? 0}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-1">
          <Button
            asChild
            variant="outline"
            className="h-8 w-full rounded-full border-slate-300 text-xs text-slate-600"
          >
            <Link href={banner.moreLink || getBannerCategoryUrl(banner)}>
              {hasMore ? `MORE (${banner.products.length - 2}+)` : 'MORE'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}