'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CarouselApi } from '@/components/ui/carousel';
import { fetchBannersByType, BannerType } from '@/lib/banner';
import type { Banner as HeroBanner } from '@/lib/banner-types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export function TopBanner() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<HeroBanner[]>([]);

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await fetchBannersByType(BannerType.TOP_BANNER);
        setBanners(data);
      } catch (error) {
        console.error('Failed to load top banners:', error);
      }
    }
    
    loadBanners();
  }, []);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    const autoplay = setInterval(() => api.scrollNext(), 5000);
    return () => {
      api.off('select', onSelect);
      clearInterval(autoplay);
    };
  }, [api]);

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[970px] overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">배너를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[970px] overflow-hidden">
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full h-full">
        <CarouselContent className="h-full">
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} className="h-full relative">
              <div className="w-full h-full relative">
                <Image
                  src={banner.imgSrc}
                  alt={banner.alt || banner.title || 'Banner Image'}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI5NzAiIHZpZXdCb3g9IjAgMCAxMjAwIDk3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iOTcwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01OTUgNDgwSDYwNVY0OTBINTk1VjQ4MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTU5MCA0NzVINjEwVjQ5NUg1OTBWNDc1WiIgc3Ryb2tlPSIjOUNBNEFGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHR0ZXh0IHg9IjYwMCIgeT0iNTIwIiBmb250LWZhbWlseT0iSW50ZXIsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTRBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SUsBmdlYWdlPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />
              </div>
              {banner.href && (
                <Link 
                  href={banner.href}
                  className="absolute inset-0 z-10"
                  aria-label={banner.alt || banner.title || 'Banner Link'}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default TopBanner;

