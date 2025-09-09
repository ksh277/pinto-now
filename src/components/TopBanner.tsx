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
    <div className="relative w-full h-[970px] overflow-hidden">
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
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI5NzAiIHZpZXdCb3g9IjAgMCAxMjAwIDk3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iOTcwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01OTUgNDgwSDYwNVY0OTBINTk1VjQ4MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTU5MCA0NzVINjEwVjQ5NUg1OTBWNDc1WiIgc3Ryb2tlPSIjOUNBNEFGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHR0ZXh0IHg9IjYwMCIgeT0iNTIwIiBmb250LWZhbWlseT0iSW50ZXIsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTRBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXJyb3I8L3RleHQ+Cjwvc3ZnPgo=';
          }}
        />
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

