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
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
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
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-blue-500 text-white';
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">주간 랭킹 - {getSellerTypeLabel(sellerType)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rankings.map((product) => (
          <Link 
            key={product.product_id} 
            href={`/products/${product.product_id}`}
            onClick={() => handleProductClick(product.product_id)}
            className="block group"
          >
            <div className="bg-white rounded-lg border p-4 hover:shadow-lg transition-shadow relative">
              {showRankNumbers && (
                <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(product.rank_position)}`}>
                  {product.rank_position}
                </div>
              )}

              <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg bg-gray-100">
                {product.product_image ? (
                  <Image
                    src={product.product_image}
                    alt={product.product_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600">
                {product.product_name}
              </h3>

              <p className="text-gray-600 text-xs mb-2">
                {product.seller_name.includes('ìƒ˜í"Œ') ? '개인창작자' : product.seller_name}
              </p>

              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">
                  {formatPrice(product.product_price)}
                </span>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}