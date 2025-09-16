'use client';

import { useEffect, useState } from 'react';
import { fetchBannersByType, BannerType } from '@/lib/banner';
import type { Banner } from '@/lib/banner-types';

export function PlatformBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await fetchBannersByType(BannerType.PLATFORM_BANNER);
        if (Array.isArray(data)) {
          const activeBanners = data.filter(banner => banner && banner.isActive !== false).slice(0, 3); // 최대 3개까지
          setBanners(activeBanners);
        }
      } catch (error) {
        console.log('Failed to load platform banners:', error);
        // Set empty array on error
        setBanners([]);
      }
    }

    loadBanners();
  }, []);

  // 자동 슬라이드 기능 (2개 이상일 때만)
  useEffect(() => {
    if (banners.length < 2) {
      setCurrentIndex(0); // 1개 이하일 때는 index를 0으로 리셋
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // 5초마다 슬라이드

    return () => clearInterval(interval);
  }, [banners.length]);

  // currentIndex가 배너 개수를 넘지 않도록 보정
  useEffect(() => {
    if (currentIndex >= banners.length && banners.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, banners.length]);

  // 배너가 없는 경우 null 반환
  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const handleBannerClick = () => {
    if (currentBanner.href && currentBanner.href !== '#') {
      window.location.href = currentBanner.href;
    }
  };

  const handleDotClick = (index: number) => {
    if (index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <section className="pt-6 pb-4 w-screen relative">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => {
            if (!banner) return null;

            return (
              <div
                key={banner.id || index}
                className="w-full flex-shrink-0 bg-[#F4F4F4] rounded-2xl py-20 px-8 text-center cursor-pointer hover:bg-[#EEEEEE] transition-colors duration-300"
                onClick={() => {
                  if (banner.href && banner.href !== '#') {
                    window.location.href = banner.href;
                  }
                }}
                style={{ margin: 0 }}
              >
                {banner.mainTitle && (
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {banner.mainTitle}
                  </h2>
                )}
                {banner.subTitle && (
                  <p className="text-gray-600 text-sm">
                    {banner.subTitle}
                  </p>
                )}

                {/* 기본 텍스트 (데이터베이스에 텍스트가 없는 경우) */}
                {!banner.mainTitle && !banner.subTitle && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      창작자, 작가 모두가 참여하는 플랫폼
                    </h2>
                    <p className="text-gray-600 text-sm">
                      다양한 창작자와 작가들이 함께 만드는 특별한 굿즈를 만나보세요
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 슬라이드 도트 표시 (2개 이상일 때만) */}
      {banners.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentIndex ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}