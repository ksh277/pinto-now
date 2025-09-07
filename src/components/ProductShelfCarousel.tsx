'use client';

import { useRef } from 'react';
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
};

type ProductShelfCarouselProps = {
  banners: ProductShelfBanner[];
};

// 배너 ID에 따라 적절한 카테고리 페이지로 매핑
function getBannerCategoryUrl(banner: ProductShelfBanner): string {
  const title = banner.title.toLowerCase();
  const id = banner.id;

  // 배너 제목이나 ID를 기반으로 적절한 카테고리 페이지로 매핑
  if (title.includes('티셔츠') || title.includes('t-shirt') || id === 's1') {
    return '/clothing-goods';
  } else if (title.includes('키링') || title.includes('keyring') || id === 's2') {
    return '/acrylic'; // 아크릴 키링은 아크릴 카테고리로
  } else if (title.includes('우산') || title.includes('umbrella') || id === 's3') {
    return '/promo-product-view'; // 우산은 단체판촉상품으로
  } else if (title.includes('스티커') || title.includes('sticker')) {
    return '/sticker-goods';
  } else if (title.includes('액자') || title.includes('frame')) {
    return '/frame-goods';
  } else if (title.includes('의류') || title.includes('clothing')) {
    return '/clothing-goods';
  } else {
    // 기본값으로 전체 상품 보기로
    return '/all';
  }
}

export default function ProductShelfCarousel({ banners }: ProductShelfCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            <div key={banner.id} className="flex-shrink-0 w-[calc(100vw-2rem)] max-w-[320px] md:w-[380px] snap-start">
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

  return (
    <div>
      {/* 배너 이미지 */}
      <div className="min-h-[240px] md:min-h-[260px] rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/70 flex flex-col justify-end p-6 relative overflow-hidden">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          className="object-cover rounded-2xl"
          sizes="(max-width: 768px) 320px, 380px"
        />
        <div className="absolute inset-0 bg-black/20 rounded-2xl" />
        <div className="relative z-10">
          <h3 className="text-[15px] font-semibold leading-6 text-white break-keep">
            {banner.title}
          </h3>
          <p className="mt-2 text-[12px] leading-6 text-white/90 break-keep">
            {banner.description}
          </p>
        </div>
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
            <Link href={getBannerCategoryUrl(banner)}>
              {hasMore ? `MORE (${banner.products.length - 2}+)` : 'MORE'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}