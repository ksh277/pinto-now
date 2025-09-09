'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CarouselApi } from '@/components/ui/carousel';
import { fetchBannersByType, BannerType, type Banner as HeroBanner } from '@/lib/banner';
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
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${banner.imgSrc})`
                }}
              />
              {banner.href && (
                <Link 
                  href={banner.href}
                  className="absolute inset-0 z-10"
                  aria-label={banner.alt || banner.title}
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

