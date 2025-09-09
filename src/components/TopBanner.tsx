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
    <div className="relative w-full h-[970px] overflow-hidden bg-red-500">
      {/* 강제 디버그 텍스트 */}
      <div className="absolute top-4 left-4 bg-yellow-400 text-black p-4 text-lg z-[999]">
        배너 개수: {banners.length}
        {banners.length > 0 && (
          <div>첫 번째 이미지: {banners[0].imgSrc}</div>
        )}
      </div>
      
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full h-full">
        <CarouselContent className="h-full">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="h-full">
              <Link href={banner.href} className="relative block w-full h-full">
                {/* 배경 이미지 - 직접 스타일 사용 */}
                <div 
                  className="absolute inset-0 w-full h-full z-0"
                  style={{
                    backgroundImage: `url("${banner.imgSrc}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1
                  }}
                  onLoad={() => console.log('Background loaded:', banner.imgSrc)}
                />
                
                {/* 디버그: 이미지 URL 확인 */}
                <div className="absolute top-4 left-4 bg-black text-white p-2 text-xs z-50">
                  Image: {banner.imgSrc}
                </div>
                
                {/* 테스트용 작은 이미지들 */}
                <div 
                  className="absolute inset-0 w-full h-full z-5"
                  style={{
                    backgroundImage: 'url("https://via.placeholder.com/800x400/FF0000/FFFFFF?text=TEST")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.8
                  }}
                />
                
                {/* 실제 배너 이미지 강제 표시 */}
                <div 
                  className="absolute top-16 left-4 w-32 h-16 border-2 border-white z-50"
                  style={{
                    backgroundImage: `url("${banner.imgSrc}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* 어두운 오버레이 */}
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                
                {/* 텍스트 콘텐츠 */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-20">
                  {banner.mainTitle && (
                    <h1 
                      className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-5xl"
                      style={{ 
                        fontFamily: "'Poppins', 'Noto Sans KR', sans-serif",
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      {banner.mainTitle}
                    </h1>
                  )}
                  
                  {banner.subTitle && (
                    <p 
                      className="text-lg md:text-2xl lg:text-3xl text-white/95 mb-8 max-w-4xl leading-relaxed"
                      style={{ 
                        fontFamily: "'Poppins', 'Noto Sans KR', sans-serif",
                        textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                      }}
                    >
                      {banner.subTitle}
                    </p>
                  )}
                  
                  {banner.moreButtonLink && (
                    <Link
                      href={banner.moreButtonLink}
                      className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black/30 hover:bg-black/50 rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                      style={{ 
                        fontFamily: "'Poppins', 'Noto Sans KR', sans-serif",
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      MORE
                    </Link>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* 슬라이드 인디케이터 */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === current 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TopBanner;

