'use client';

import { useEffect, useState } from 'react';
import { fetchBannersByType, BannerType } from '@/lib/banner';
import type { Banner } from '@/lib/banner-types';
export function PlatformBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    async function loadBanner() {
      try {
        const data = await fetchBannersByType(BannerType.PLATFORM_BANNER);
        if (data.length > 0) {
          setBanner(data[0]); // PLATFORM_BANNER는 1개만 허용
        }
      } catch (error) {
        // Failed to load platform banner
      }
    }
    
    loadBanner();
  }, []);

  // 배너가 없거나 비활성화된 경우 null 반환
  if (!banner || banner.isActive === false) {
    return null;
  }

  const handleBannerClick = () => {
    if (banner.href && banner.href !== '#') {
      window.location.href = banner.href;
    }
  };

  return (
    <section className="pt-6 pb-4 w-screen">
      <div 
        className="w-full bg-[#F4F4F4] rounded-2xl py-20 px-8 text-center cursor-pointer hover:bg-[#EEEEEE] transition-colors"
        onClick={handleBannerClick}
        style={{ margin: 0, paddingLeft: 0 }}
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
    </section>
  );
}