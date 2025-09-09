'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
}

export default function WeeklyRankingCards({ 
  sellerType = 'CREATOR', 
  limit = 10, 
  showRankNumbers = true,
  className = '' 
}: WeeklyRankingCardsProps) {
  const [rankings, setRankings] = useState<WeeklyRankingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekRange, setWeekRange] = useState<{ start: string; end: string } | null>(null);

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
        setWeekRange({
          start: result.weekStart,
          end: result.weekEnd
        });
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
      console.warn('Failed to track click:', err);
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
      case 'CREATOR': return '창작자';
      case 'AUTHOR': return '작가';
      case 'INDIVIDUAL': return '개인';
      default: return type;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    return 'bg-blue-500 text-white shadow-lg';
  };

  const getRankLabel = (rank: number) => {
    return `BEST ${rank}`;
  };

  const getCreatorDescription = (sellerName: string, rank: number) => {
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
          <h2 className="text-xl font-bold">주간 랭킹 - {getSellerTypeLabel(sellerType)}</h2>
        </div>
        <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl border p-3 md:p-4 animate-pulse w-[calc(100vw-3rem)] max-w-[300px] md:w-auto flex-shrink-0 md:flex-shrink">
              <div className="w-full h-64 md:h-80 bg-gray-300 rounded-lg mb-3 md:mb-4"></div>
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
        <p className="text-red-500 mb-4">랭킹을 불러오는데 실패했습니다: {error}</p>
        <button
          onClick={fetchWeeklyRankings}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">이번 주 {getSellerTypeLabel(sellerType)} 랭킹이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">주간 랭킹 - {getSellerTypeLabel(sellerType)}</h2>
        {weekRange && (
          <span className="text-sm text-gray-500">
            {weekRange.start} ~ {weekRange.end}
          </span>
        )}
      </div>

      {/* Mobile: Horizontal scroll, Desktop: 4 columns in 1 row */}
      <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
        {rankings.map((product, index) => (
          <Link 
            key={product.product_id} 
            href={`/products/${product.product_id}`}
            onClick={() => handleProductClick(product.product_id)}
            className="block group"
          >
            <div className="bg-white rounded-xl border-2 border-gray-100 p-3 md:p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative w-[calc(100vw-3rem)] max-w-[350px] md:max-w-none md:w-auto flex-shrink-0 md:flex-shrink flex md:block gap-4 md:gap-0">
              {showRankNumbers && (
                <div className={`absolute -top-2 -left-2 px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadgeColor(index + 1)} transform rotate-3 z-10`}>
                  {getRankLabel(index + 1)}
                </div>
              )}

              <div className="relative w-24 h-24 md:w-full md:h-80 flex-shrink-0 md:mb-3 overflow-hidden rounded-xl bg-gray-100 shadow-md">
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
                    {getCreatorDescription(product.seller_name, index + 1)}
                  </p>
                </div>

                <div className="pt-1 md:pt-2 border-t border-gray-100">
                  <span className="font-bold text-blue-600 text-base md:text-lg">
                    {formatPrice(product.product_price)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">부터</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}