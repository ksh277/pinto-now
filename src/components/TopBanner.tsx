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
        console.log('TopBanner: Loading banners...');
        const data = await fetchBannersByType(BannerType.TOP_BANNER);
        console.log('TopBanner: Received data:', data);
        if (data.length > 0) {
          setBanners(data);
          console.log('TopBanner: Banners set:', data.length);
        } else {
          console.log('TopBanner: No banners found');
        }
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

  console.log('TopBanner: Rendering with banners count:', banners.length);

  // 배너가 없을 때 기본 메시지 표시
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[970px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-xl">배너를 불러오는 중...</p>
          <p className="text-gray-400 text-sm mt-2">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[970px] overflow-hidden">
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full h-full">
        <CarouselContent className="h-full">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="h-full">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${banner.imgSrc})`
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default TopBanner;

