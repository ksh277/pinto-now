'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ReviewForm from '@/components/ReviewForm';
import ReviewCard from '@/components/ReviewCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MockOrder {
  id: number;
  product_id: number;
  product_name: string;
  order_item_id: number;
  status: 'delivered' | 'pending';
}

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

export default function TestReviewsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingMockOrder, setIsCreatingMockOrder] = useState(false);
  const [mockOrders, setMockOrders] = useState<MockOrder[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState<MockOrder | null>(null);

  // 모든 테스트 데이터 정리
  const clearAllTestData = async () => {
    try {
      // 모든 테스트 리뷰 삭제
      await fetch('/api/test-reviews/clear', { method: 'DELETE' });

      setMockOrders([]);
      setReviews([]);
      setSelectedOrderItem(null);

      toast({
        title: "테스트 데이터 정리 완료",
        description: "모든 테스트 리뷰와 주문 데이터가 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "정리 실패",
        description: "테스트 데이터 정리에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 모의 주문 생성 (테스트용)
  const createMockOrder = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "테스트를 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingMockOrder(true);
    try {
      const mockOrder: MockOrder = {
        id: Date.now(),
        product_id: Math.floor(Math.random() * 10) + 1, // 1-10 랜덤 상품 ID
        product_name: `테스트 상품 ${Math.floor(Math.random() * 100)}`,
        order_item_id: Date.now() + Math.floor(Math.random() * 1000),
        status: 'delivered'
      };

      setMockOrders(prev => [...prev, mockOrder]);

      toast({
        title: "모의 주문 생성 완료",
        description: `${mockOrder.product_name}에 대한 배송완료 주문이 생성되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "모의 주문 생성 실패",
        description: "오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingMockOrder(false);
    }
  };

  // 리뷰 목록 가져오기
  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?limit=20');
      const result = await response.json();

      if (result.success) {
        setReviews(result.data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  // 리뷰 작성 성공 시 처리
  const handleReviewSuccess = () => {
    setSelectedOrderItem(null);
    fetchReviews(); // 리뷰 목록 새로고침
    toast({
      title: "리뷰 작성 완료",
      description: "리뷰가 성공적으로 등록되어 목록에 반영되었습니다!",
    });
  };

  // 컴포넌트 마운트 시 리뷰 목록 로드
  useEffect(() => {
    fetchReviews();
  }, []);

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">리뷰 시스템을 테스트하려면 먼저 로그인해주세요.</p>
            <Button>로그인하기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>리뷰 시스템 테스트</span>
            <Button
              onClick={clearAllTestData}
              variant="destructive"
              size="sm"
            >
              모든 테스트 데이터 정리
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="test" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="test">리뷰 작성 테스트</TabsTrigger>
              <TabsTrigger value="reviews">작성된 리뷰 목록</TabsTrigger>
              <TabsTrigger value="guide">테스트 가이드</TabsTrigger>
            </TabsList>

            <TabsContent value="test" className="space-y-6 mt-6">
              {/* 모의 주문 생성 */}
              <Card>
                <CardHeader>
                  <CardTitle>1단계: 모의 주문 생성</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={createMockOrder}
                      disabled={isCreatingMockOrder}
                    >
                      {isCreatingMockOrder ? '생성 중...' : '모의 주문 생성 (배송완료)'}
                    </Button>

                    <div className="space-y-2">
                      <h4 className="font-semibold">생성된 주문 목록:</h4>
                      {mockOrders.length === 0 ? (
                        <p className="text-gray-500">아직 생성된 주문이 없습니다.</p>
                      ) : (
                        <div className="space-y-2">
                          {mockOrders.map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-3 border rounded"
                            >
                              <div>
                                <span className="font-medium">{order.product_name}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  (주문 ID: {order.order_item_id})
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => setSelectedOrderItem(order)}
                                disabled={!!selectedOrderItem}
                              >
                                리뷰 작성
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 리뷰 작성 폼 */}
              {selectedOrderItem && (
                <Card>
                  <CardHeader>
                    <CardTitle>2단계: 리뷰 작성</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReviewForm
                      productId={selectedOrderItem.product_id}
                      productName={selectedOrderItem.product_name}
                      orderItemId={selectedOrderItem.order_item_id}
                      onSuccess={handleReviewSuccess}
                      onCancel={() => setSelectedOrderItem(null)}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">작성된 리뷰 목록</h3>
                <Button onClick={fetchReviews} variant="outline" size="sm">
                  새로고침
                </Button>
              </div>

              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      리뷰 작성 테스트 탭에서 리뷰를 작성해보세요.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onClick={() => {
                        toast({
                          title: "리뷰 클릭됨",
                          description: `${review.product_name}에 대한 리뷰입니다.`,
                        });
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="guide" className="space-y-6 mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>리뷰 시스템 테스트 가이드</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">✅ 테스트 항목:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>주문자만 리뷰 작성 가능:</strong> 모의 주문 생성 후에만 리뷰 작성 버튼 활성화</li>
                        <li><strong>이미지 업로드:</strong> 실제 파일 업로드 및 서버 저장 (public/uploads/reviews/)</li>
                        <li><strong>리뷰 목록 실시간 반영:</strong> 작성 후 즉시 목록에 표시</li>
                        <li><strong>중복 리뷰 방지:</strong> 같은 주문 아이템에 대해 한 번만 리뷰 작성 가능</li>
                        <li><strong>권한 검증:</strong> 본인 주문에 대해서만 리뷰 작성 가능</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">🔧 개선된 기능:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>주문자 검증: order_item_id와 user_id 매칭 확인</li>
                        <li>이미지 저장: base64 → 실제 파일 저장으로 변경</li>
                        <li>리뷰 목록: 작성 후 자동 새로고침</li>
                        <li>에러 처리: 상세한 오류 메시지 제공</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">📝 테스트 순서:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>로그인 상태인지 확인</li>
                        <li>"모의 주문 생성" 버튼 클릭</li>
                        <li>생성된 주문의 "리뷰 작성" 버튼 클릭</li>
                        <li>별점, 리뷰 내용 입력</li>
                        <li>이미지 업로드 테스트 (최대 5개, 5MB)</li>
                        <li>리뷰 등록 후 "작성된 리뷰 목록" 탭에서 확인</li>
                        <li>같은 주문에 다시 리뷰 작성 시도 (중복 방지 확인)</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}