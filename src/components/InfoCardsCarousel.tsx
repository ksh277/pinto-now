'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type InfoCard = {
  id: string;
  title: string;
  description: string;
};

type InfoCardsCarouselProps = {
  cards: InfoCard[];
};

export default function InfoCardsCarousel({ cards }: InfoCardsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (cards.length <= 4) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 px-2 md:px-8">
        {cards.map(card => (
          <div
            key={card.id}
            className="min-h-[300px] md:min-h-[340px] rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/70 flex flex-col justify-end p-6"
          >
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold leading-6 text-neutral-900 dark:text-neutral-100 break-keep">
                {card.title}
              </h3>
              <p className="text-[12px] leading-6 text-neutral-600 dark:text-neutral-300 break-keep">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative px-2 md:px-8">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map(card => (
          <div
            key={card.id}
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start min-h-[300px] md:min-h-[340px] rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/70 flex flex-col justify-end p-6"
          >
            <div className="space-y-3">
              <h3 className="text-[15px] font-semibold leading-6 text-neutral-900 dark:text-neutral-100 break-keep">
                {card.title}
              </h3>
              <p className="text-[12px] leading-6 text-neutral-600 dark:text-neutral-300 break-keep">
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