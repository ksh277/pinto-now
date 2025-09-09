'use client';

import { useEffect, useState } from 'react';
import { fetchBannersByType, BannerType } from '@/lib/banner';
import type { Banner as HeroBanner } from '@/lib/banner-types';

export function TopBanner() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadBanners() {
      try {
        console.log('Loading TOP_BANNER data...');
        const data = await fetchBannersByType(BannerType.TOP_BANNER);
        console.log('Loaded banners:', data);
        setBanners(data);
      } catch (error) {
        console.error('Failed to load top banners:', error);
      }
    }
    
    loadBanners();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[700px] overflow-hidden">
      {/* 핵심 패치: Next/Image 완전 OFF, 원본 그대로 */}
      <a 
        href={currentBanner.href || '#'} 
        className="block relative w-full h-full"
      >
        <img
          src={currentBanner.imgSrc}
          alt={currentBanner.alt || currentBanner.title || 'Banner'}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block' 
          }}
          loading="eager"
          onLoad={() => console.log(`✅ Banner loaded: ${currentBanner.imgSrc}`)}
          onError={(e) => {
            console.error(`❌ Failed to load: ${currentBanner.imgSrc}`);
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI5NzAiIHZpZXdCb3g9IjAgMCAxMjAwIDk3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iOTcwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01OTUgNDgwSDYwNVY0OTBINTk1VjQ4MFoiIGZpbGw9IiM5Q0E0QUYiLz4KUGFYCEOdnkgZD0iTTU5MCA0NzVINjEwVjQ5NUg1OTBWNDc1WiIgc3Ryb2tlPSIjOUNBNEFGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHR0ZXh0IHg9IjYwMCIgeT0iNTIwIiBmb250LWZhbWlseT0iSW50ZXIsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTRBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXJyb3I8L3RleHQ+Cjwvc3ZnPgo=';
          }}
        />
        
        {/* 텍스트 오버레이 - 정가운데 */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center" style={{ color: '#505050' }}>
            {/* 대제목 */}
            {currentBanner.mainTitle && (
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                {currentBanner.mainTitle}
              </h1>
            )}
            
            {/* 소제목 */}
            {currentBanner.subTitle && (
              <p className="text-lg md:text-2xl mb-8 drop-shadow-lg max-w-2xl mx-auto">
                {currentBanner.subTitle}
              </p>
            )}
            
            {/* MORE 버튼 */}
            {currentBanner.moreButtonLink && (
              <a
                href={currentBanner.moreButtonLink}
                className="inline-block bg-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                style={{ color: '#505050' }}
                onClick={(e) => e.stopPropagation()} // 배너 링크와 충돌 방지
              >
                MORE
              </a>
            )}
          </div>
        </div>
      </a>
      
      {/* 다중 배너일 때 인디케이터 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TopBanner;

