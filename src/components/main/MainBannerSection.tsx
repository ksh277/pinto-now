"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fetchBanners, BannerType, type Banner } from '@/lib/banner';

export default function MainBannerSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // API에서 배너 데이터 로드
    async function loadBanners() {
      try {
        const data = await fetchBanners({
          bannerType: BannerType.HOME_SLIDER_PC,
          sort: 'sort_order',
          order: 'asc'
        });
        if (data.length > 0) {
          setBanners(data);
        }
      } catch (error) {
        console.error('Failed to load main banners:', error);
      }
    }
    
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className="relative w-full h-[200px] md:h-[250px] overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src={currentBanner.imgSrc || '/images/banner-default.jpg'}
          alt={currentBanner.alt || '배너'}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-xl font-bold md:text-2xl text-white mb-2">
            창작자, 작가 모두가 참여하는 플랫폼 PINTO
          </h2>
          <p className="text-white/90 mb-6 max-w-lg">
            재고 걱정 없이 디자인만으로 수익을 창출하는 새로운 방법을 알아보세요.
          </p>
          <Button 
            variant="outline" 
            className="border-white text-black hover:bg-white hover:text-black"
            onClick={() => currentBanner.href && window.open(currentBanner.href, '_blank')}
          >
            판매방법 알아보기
          </Button>
        </div>
        
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
