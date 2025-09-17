'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

interface WeeklyRankingProduct {
  product_id: number;
  seller_type: string;
  sales_count: number;
  click_count: number;
  ranking_score: number;
  rank_position: number;
  product_name: string;
  product_price: number;
  product_image: string;
  seller_name: string;
}

interface WeeklyRankingCardsProps {
  sellerType?: 'CREATOR' | 'AUTHOR' | 'INDIVIDUAL';
  limit?: number;
  showRankNumbers?: boolean;
  className?: string;
  layout?: 'homepage' | 'full-page'; // 메인페이지용인지 전체 페이지용인지 구분
}

export default function WeeklyRankingCards({
  sellerType = 'CREATOR',
  limit = 10,
  showRankNumbers = true,
  className = '',
  layout = 'homepage'
}: WeeklyRankingCardsProps) {
  const { t } = useLanguage();
  const [rankings, setRankings] = useState<WeeklyRankingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Removed weekRange state as it's no longer displayed

  useEffect(() => {
    fetchWeeklyRankings();
  }, [sellerType, limit]);

  const fetchWeeklyRankings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        sellerType,
        limit: limit.toString()
      });

      const response = await fetch(`/api/weekly-rankings?${params}`);
      const result = await response.json();

      if (result.success) {
        setRankings(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch rankings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = async (productId: number) => {
    try {
      await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userId: null // Can be updated to include user ID if auth is available
        })
      });
    } catch (err) {
      // Silently fail click tracking
    }
  };

  const formatPrice = (price: number) => {
    return `~${new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price)}`;
  };

  const getSellerTypeLabel = (type: string) => {
    switch (type) {
      case 'CREATOR': return t('ranking.creator');
      case 'AUTHOR': return t('ranking.author');
      case 'INDIVIDUAL': return t('ranking.individual');
      default: return type;
    }
  };

  const getRankBadgeColor = () => {
    return 'bg-blue-500 text-white shadow-lg';
  };

  const getRankLabel = (rank: number) => {
    return `BEST ${rank}`;
  };

  const getCreatorDescription = (rank: number) => {
    const descriptions = [
      '인기 급상승 창작자입니다',
      '꾸준한 사랑받는 작품을 만들어요',  
      '독창적인 아이디어로 주목받고 있어요',
      '고품질 굿즈 전문 창작자예요'
    ];
    return descriptions[(rank - 1) % descriptions.length];
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{t('ranking.weekly_title')}</h2>
        </div>
        <div className={
          layout === 'homepage'
            ? "flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        }>
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className={`bg-white rounded-xl border p-3 md:p-4 animate-pulse ${
              layout === 'homepage'
                ? "w-[280px] md:w-full flex-shrink-0 snap-center"
                : "w-full"
            }`}>
              <div className={`bg-gray-300 rounded-lg mb-3 md:mb-4 ${
                layout === 'homepage'
                  ? "w-full h-[280px] md:h-80 aspect-square"
                  : "w-full h-96"
              }`}></div>
              <div className="h-3 md:h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-2 md:h-3 bg-gray-300 rounded w-2/3 mb-1 md:mb-2"></div>
              <div className="h-2 md:h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-500 mb-4">{t('ranking.loading_failed')}: {error}</p>
        <button
          onClick={fetchWeeklyRankings}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('ranking.retry')}
        </button>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">{t('ranking.no_rankings').replace('{type}', getSellerTypeLabel(sellerType))}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className={
        layout === 'homepage'
          ? "flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      }>
        {rankings.map((product, index) => (
          <Link 
            key={product.product_id} 
            href={`/products/${product.product_id}`}
            onClick={() => handleProductClick(product.product_id)}
            className="block group"
          >
            <div className={`bg-white rounded-xl border-2 border-gray-100 p-3 md:p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative ${
              layout === 'homepage'
                ? "w-[280px] md:w-full flex flex-col flex-shrink-0 snap-center"
                : "w-full flex flex-col"
            }`}>
              {showRankNumbers && (
                <div className={`absolute -top-2 -left-2 px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadgeColor()} transform rotate-3 z-10`}>
                  {getRankLabel(index + 1)}
                </div>
              )}

              <div className={`relative overflow-hidden rounded-xl bg-gray-100 shadow-md ${
                layout === 'homepage'
                  ? "w-full h-[280px] md:h-80 mb-3 md:mb-3 aspect-square"
                  : "w-full h-96 mb-4"
              }`}>
                {product.product_image ? (
                  <Image
                    src={product.product_image}
                    alt={product.product_name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                    🖼️
                  </div>
                )}
                
                {/* 호버 시 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                  {product.product_name}
                </h3>

                <div className="space-y-1">
                  <p className="text-gray-700 text-xs md:text-sm font-medium">
                    {product.seller_name.includes('샘플') ? `창작자 ${String.fromCharCode(65 + index)}` : product.seller_name}
                  </p>
                  
                  <p className="text-gray-500 text-xs leading-relaxed hidden md:block">
                    {getCreatorDescription(index + 1)}
                  </p>
                </div>

                <div className="pt-1 md:pt-2 border-t border-gray-100">
                  <span className="font-bold text-blue-600 text-base md:text-lg">
                    {formatPrice(product.product_price)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">{t('ranking.from_price')}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}