'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type InfoCard = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
};

type InfoCardsCarouselProps = {
  cards: InfoCard[];
};

export default function InfoCardsCarousel({ cards }: InfoCardsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 최대 8개로 제한
  const displayCards = cards.slice(0, 8);
  
  // 무한 스크롤을 위해 앞뒤로 카드 복제
  const infiniteCards = displayCards.length > 0 ? [
    ...displayCards.slice(-1), // 마지막 카드를 앞에 복제
    ...displayCards,
    ...displayCards.slice(0, 1)  // 첫 번째 카드를 뒤에 복제
  ] : [];

  const scrollLeft = () => {
    if (scrollRef.current && displayCards.length > 0) {
      const container = scrollRef.current;
      const itemWidth = container.scrollWidth / infiniteCards.length;
      const currentScroll = container.scrollLeft;
      const targetScroll = currentScroll - itemWidth;
      
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      
      // 첫 번째 복제본에 도달했으면 실제 마지막으로 점프
      setTimeout(() => {
        if (container.scrollLeft <= 0) {
          container.scrollLeft = itemWidth * displayCards.length;
        }
      }, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && displayCards.length > 0) {
      const container = scrollRef.current;
      const itemWidth = container.scrollWidth / infiniteCards.length;
      const currentScroll = container.scrollLeft;
      const targetScroll = currentScroll + itemWidth;
      
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      
      // 마지막 복제본에 도달했으면 실제 첫 번째로 점프
      setTimeout(() => {
        const maxScroll = itemWidth * (displayCards.length + 1);
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = itemWidth;
        }
      }, 300);
    }
  };

  // 초기 위치를 첫 번째 실제 카드로 설정
  React.useEffect(() => {
    if (scrollRef.current && displayCards.length > 0) {
      const itemWidth = scrollRef.current.scrollWidth / infiniteCards.length;
      scrollRef.current.scrollLeft = itemWidth; // 첫 번째 실제 카드 위치
    }
  }, [displayCards.length, infiniteCards.length]);

  if (displayCards.length <= 4) {
    return (
      <div className="grid grid-cols-1 gap-[55px] sm:grid-cols-2 lg:grid-cols-4">
        {displayCards.map(card => (
          <div
            key={card.id}
            className="min-h-[300px] md:min-h-[340px] rounded-2xl overflow-hidden bg-neutral-200/80 dark:bg-neutral-800/70 relative flex flex-col justify-end"
          >
            {card.imageUrl && (
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-6 space-y-3">
              <h3 className="text-[15px] font-semibold leading-6 text-white break-keep">
                {card.title}
              </h3>
              <p className="text-[12px] leading-6 text-white/90 break-keep">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          gap: '55px'
        }}
      >
        {infiniteCards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="flex-shrink-0 snap-start min-h-[300px] md:min-h-[340px] rounded-2xl overflow-hidden bg-neutral-200/80 dark:bg-neutral-800/70 relative flex flex-col justify-end"
            style={{ width: 'calc(25% - 41.25px)' }} // 4개 표시를 위한 계산된 너비
          >
            {card.imageUrl && (
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-6 space-y-3">
              <h3 className="text-[15px] font-semibold leading-6 text-white break-keep">
                {card.title}
              </h3>
              <p className="text-[12px] leading-6 text-white/90 break-keep">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-colors z-10"
        onClick={scrollLeft}
        aria-label="이전 카드"
      >
        <ChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-colors z-10"
        onClick={scrollRight}
        aria-label="다음 카드"
      >
        <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
      </button>
    </div>
  );
}