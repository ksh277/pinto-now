'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import Image from 'next/image';

interface ReviewCardProps {
  review: {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    content: string;
    images: string[];
    like_count: number;
    comment_count: number;
    created_at: string;
    user_nickname: string;
    product_name: string;
  };
  onClick: () => void;
}

export default function ReviewCard({ review, onClick }: ReviewCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.like_count);

  useEffect(() => {
    if (user) {
      fetchLikeStatus();
    }
  }, [user, review.id]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/reviews/${review.id}/like`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsLiked(data.data.isLiked);
        setLikeCount(data.data.likeCount);
      }
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/reviews/${review.id}/like`, {
        method,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setIsLiked(!isLiked);
        setLikeCount(result.likeCount);
      } else {
        alert(result.error || '좋아요 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Like error:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        {/* 리뷰 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex">{generateStars(review.rating)}</div>
            <span className="text-sm text-gray-600">{review.rating}.0</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-sm text-blue-600">
            {review.product_name}
          </h3>
          <span className="text-sm text-gray-600">by {review.user_nickname}</span>
        </div>

        {/* 리뷰 이미지 미리보기 */}
        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <div className="relative aspect-video w-full max-w-[200px] rounded-lg overflow-hidden">
              <Image
                src={review.images[0]}
                alt="리뷰 사진"
                fill
                className="object-cover"
                sizes="200px"
              />
              {review.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  +{review.images.length - 1}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 리뷰 내용 미리보기 */}
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {truncateContent(review.content)}
        </p>

        {/* 상호작용 버튼 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors hover:bg-gray-100 px-2 py-1 rounded ${
              isLiked 
                ? 'text-blue-600 hover:text-blue-700' 
                : 'hover:text-blue-600'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>
          <div className="flex items-center gap-1 text-gray-500">
            <MessageCircle className="w-4 h-4" />
            {review.comment_count}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}