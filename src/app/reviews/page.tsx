'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Filter, Search, Plus } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth/AuthContext';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { ReviewModal } from '@/components/ReviewModal';

interface Review {
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
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showWriteDialog, setShowWriteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async (page = 1, rating: number | null = null) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort: sortBy,
        order: sortOrder,
      });
      
      if (rating) {
        params.append('rating', rating.toString());
      }

      const response = await fetch(`/api/reviews?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setReviews(result.data.reviews);
        setCurrentPage(result.data.pagination.page);
        setTotalPages(result.data.pagination.totalPages);
        
        // 통계 계산
        const total = result.data.pagination.total;
        if (total > 0) {
          // 실제로는 별도의 통계 API를 만들어야 하지만, 여기서는 현재 페이지 데이터로 추정
          const avgRating = result.data.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / result.data.reviews.length;
          setReviewStats({
            totalReviews: total,
            averageRating: avgRating,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Fetch reviews error:', error);
      toast({
        title: "리뷰 로딩 실패",
        description: "리뷰를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, selectedRating);
  }, [sortBy, sortOrder, selectedRating]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchReviews(newPage, selectedRating);
    }
  };

  const handleRatingFilter = (rating: number | null) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string, newOrder: string) => {
    setSortBy(newSort);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReview(null);
    // 모달이 닫힐 때 리뷰 목록 새로고침 (좋아요/댓글 수 업데이트 반영)
    fetchReviews(currentPage, selectedRating);
  };

  const handleReviewSubmitted = () => {
    setShowWriteDialog(false);
    fetchReviews(1, selectedRating);
    toast({
      title: "리뷰가 등록되었습니다",
      description: "소중한 후기 감사합니다!",
    });
  };

  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                고객 리뷰
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                실제 후기와 평점을 확인하세요
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                핀토에서 제작한 굿즈에 대한 고객들의 솔직한 리뷰와 평점을 만나보세요.
              </p>
              
              {/* Review Stats */}
              <div className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl shadow-sm max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-6 h-6 ${
                          star <= Math.floor(reviewStats.averageRating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {reviewStats.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  총 {reviewStats.totalReviews.toLocaleString()}개의 리뷰
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={showWriteDialog} onOpenChange={setShowWriteDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                      <Plus className="w-4 h-4 mr-2" />
                      리뷰 작성하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>리뷰 작성</DialogTitle>
                    </DialogHeader>
                    <ReviewForm
                      productId={1} // 임시 상품 ID
                      productName="테스트 상품"
                      onSuccess={handleReviewSubmitted}
                      onCancel={() => setShowWriteDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white dark:bg-slate-800 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  variant={selectedRating === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleRatingFilter(null)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  전체 보기
                </Button>
                <Button 
                  variant={selectedRating === 5 ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleRatingFilter(5)}
                >
                  ⭐ 5점
                </Button>
                <Button 
                  variant={selectedRating === 4 ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleRatingFilter(4)}
                >
                  ⭐ 4점 이상
                </Button>
              </div>
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  handleSortChange(sort, order);
                }}
              >
                <option value="created_at-DESC">최신순</option>
                <option value="rating-DESC">평점 높은 순</option>
                <option value="rating-ASC">평점 낮은 순</option>
                <option value="like_count-DESC">도움이 된 순</option>
              </select>
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">리뷰를 불러오는 중...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onClick={() => handleReviewClick(review)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedRating ? `${selectedRating}점 리뷰가 없습니다.` : '등록된 리뷰가 없습니다.'}
                </p>
                <Dialog open={showWriteDialog} onOpenChange={setShowWriteDialog}>
                  <DialogTrigger asChild>
                    <Button>첫 번째 리뷰를 작성해보세요</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>리뷰 작성</DialogTitle>
                    </DialogHeader>
                    <ReviewForm
                      productId={1}
                      productName="테스트 상품"
                      onSuccess={handleReviewSubmitted}
                      onCancel={() => setShowWriteDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    이전
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > totalPages) return null;
                    return (
                      <Button 
                        key={page}
                        size="sm" 
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    다음
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Write Review CTA */}
        <section className="py-16 bg-gradient-to-r from-yellow-600 to-orange-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              구매하신 제품의 리뷰를 남겨주세요
            </h2>
            <p className="text-xl text-yellow-100 mb-8">
              소중한 후기가 다른 고객들에게 큰 도움이 됩니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={showWriteDialog} onOpenChange={setShowWriteDialog}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary">
                    리뷰 작성하기
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>리뷰 작성</DialogTitle>
                  </DialogHeader>
                  <ReviewForm
                    productId={1}
                    productName="테스트 상품"
                    onSuccess={handleReviewSubmitted}
                    onCancel={() => setShowWriteDialog(false)}
                  />
                </DialogContent>
              </Dialog>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-yellow-600">
                <Link href="/guide">주문 가이드 보기</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Review Modal */}
        <ReviewModal
          review={selectedReview}
          isOpen={showModal}
          onClose={handleCloseModal}
        />
      </div>
    </StripBannerProvider>
  );
}