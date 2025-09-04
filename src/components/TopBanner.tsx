'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CarouselApi } from '@/components/ui/carousel';
import { fetchBanners, type Banner as HeroBanner } from '@/lib/banner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}
export function TopBanner() {
  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrent] = useState(0);
  const [banners, setBanners] = useState<HeroBanner[]>([]);

  useEffect(() => {
    // DB에서 배너를 가져오지 말고 직접 로컬 이미지 사용
    setBanners([
      {
        id: 'banner1',
        href: '/',
        imgSrc: '/images/sample-banner1.svg',
        alt: 'PINTO 배너 1',
      },
      {
        id: 'banner2', 
        href: '/akril-goods',
        imgSrc: '/images/sample-banner2.svg',
        alt: 'PINTO 배너 2',
      },
      {
        id: 'banner3',
        href: '/guide/order',
        imgSrc: '/images/sample-banner3.svg',
        alt: 'PINTO 배너 3',
      },
      {
        id: 'banner4',
        href: '/reviews',
        imgSrc: '/images/sample-banner4.svg',
        alt: 'PINTO 배너 4',
      },
    ]);
  }, []);

  const slides = chunk(banners, 2);

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

  return (
    <div className="relative">
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
        <CarouselContent>
          {slides.map((group, idx) => (
            <CarouselItem key={idx}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {group.map((b) => (
                  <Link
                    key={b.id}
                    href={b.href}
                    className="relative block w-full aspect-[4/3] overflow-hidden"
                  >
                    <Image
                      src={b.imgSrc}
                      alt={b.alt}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </Link>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default TopBanner;

