import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star, ThumbsUp, MessageCircle, Filter, Search } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

export const metadata = {
  title: '고객 리뷰 | 실제 후기와 평점을 확인하세요 | PINTO',
  description: '핀토에서 제작한 굿즈에 대한 실제 고객들의 솔직한 리뷰와 평점을 확인해보세요. 포토 리뷰와 상세한 후기를 통해 제품 품질을 미리 확인할 수 있습니다.',
  alternates: {
    canonical: 'https://pinto.co.kr/reviews'
  },
  openGraph: {
    title: '고객 리뷰 | PINTO',
    description: '실제 고객들의 솔직한 리뷰와 평점으로 핀토의 품질을 확인해보세요.',
    url: 'https://pinto.co.kr/reviews',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '고객 리뷰 메인 이미지'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '고객 리뷰 | PINTO',
    description: '실제 고객들의 솔직한 리뷰와 평점으로 핀토의 품질을 확인해보세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

const reviews = [
  {
    id: 'review-1',
    productName: '아크릴 키링',
    customerName: '김**',
    rating: 5,
    date: '2024-02-15',
    images: ['/components/img/placeholder-product.jpg', '/components/img/placeholder-product.jpg'],
    content: '정말 만족스럽습니다! 디자인도 정확하게 나왔고 품질도 기대 이상이에요. 친구들한테 선물로 나눠줬는데 모두 좋아해서 추가 주문 예정입니다.',
    likes: 12,
    replies: 3,
    tags: ['품질우수', '배송빨라', '추천']
  },
  {
    id: 'review-2',
    productName: '맞춤 티셔츠',
    customerName: '이**',
    rating: 4,
    date: '2024-02-12',
    images: ['/components/img/placeholder-product.jpg'],
    content: '디자인이 선명하게 잘 나왔어요. 원단 질도 좋고 사이즈도 딱 맞습니다. 다만 배송이 생각보다 오래 걸렸어요. 그래도 결과물에는 만족합니다!',
    likes: 8,
    replies: 1,
    tags: ['디자인우수', '원단좋음']
  },
  {
    id: 'review-3',
    productName: '머그컵',
    customerName: '박**',
    rating: 5,
    date: '2024-02-10',
    images: ['/components/img/placeholder-product.jpg', '/components/img/placeholder-product.jpg', '/components/img/placeholder-product.jpg'],
    content: '회사 단체 주문으로 50개 제작했는데 하나같이 퀄리티가 좋네요. 로고도 정확하게 들어갔고 포장도 깔끔했습니다. 직원들 반응이 너무 좋아서 또 주문할 예정이에요.',
    likes: 15,
    replies: 2,
    tags: ['단체주문', '만족', '재주문예정']
  },
  {
    id: 'review-4',
    productName: '다꾸 스티커',
    customerName: '최**',
    rating: 5,
    date: '2024-02-08',
    images: ['/components/img/placeholder-product.jpg'],
    content: '다꾸용으로 주문했는데 컷팅이 정말 깔끔해요! 색감도 선명하고 떼기도 쉬워서 다이어리 꾸미기가 더 재미있어졌어요. 다음에 또 주문할게요~',
    likes: 9,
    replies: 4,
    tags: ['컷팅깔끔', '색감선명', '다꾸']
  },
  {
    id: 'review-5',
    productName: '텀블러',
    customerName: '정**',
    rating: 4,
    date: '2024-02-05',
    images: ['/components/img/placeholder-product.jpg'],
    content: '보온 기능도 좋고 디자인도 예뻐요. 용량도 적당하고 무게도 부담스럽지 않아서 들고 다니기 좋습니다. 다만 뚜껑 부분이 조금 뻣뻣한 것 같아요.',
    likes: 6,
    replies: 0,
    tags: ['보온우수', '디자인예쁨']
  },
  {
    id: 'review-6',
    productName: '아크릴 스탠드',
    customerName: '한**',
    rating: 5,
    date: '2024-02-03',
    images: ['/components/img/placeholder-product.jpg', '/components/img/placeholder-product.jpg'],
    content: '팬아트로 제작했는데 투명도도 좋고 인쇄 품질도 훌륭해요! 받침대도 안정적이고 크기도 딱 좋네요. 덕질용으로 최고입니다 ㅠㅠ',
    likes: 23,
    replies: 7,
    tags: ['투명도좋음', '인쇄품질우수', '팬굿즈']
  }
];

const reviewStats = {
  totalReviews: 1247,
  averageRating: 4.8,
  ratingDistribution: {
    5: 892,
    4: 234,
    3: 89,
    2: 23,
    1: 9
  }
};

export default function ReviewsPage() {
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
                    {reviewStats.averageRating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  총 {reviewStats.totalReviews.toLocaleString()}개의 리뷰
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
                  리뷰 작성하기
                </Button>
                <Button variant="outline" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  리뷰 검색
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white dark:bg-slate-800 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  전체 보기
                </Button>
                <Button variant="outline" size="sm">
                  ⭐ 5점
                </Button>
                <Button variant="outline" size="sm">
                  ⭐ 4점 이상
                </Button>
                <Button variant="outline" size="sm">
                  📸 포토 리뷰
                </Button>
              </div>
              <select className="px-3 py-2 border rounded-lg text-sm">
                <option>최신순</option>
                <option>평점 높은 순</option>
                <option>평점 낮은 순</option>
                <option>도움이 된 순</option>
              </select>
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-blue-600">
                        {review.productName}
                      </h3>
                      <span className="text-sm text-gray-600">by {review.customerName}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Review Images */}
                    {review.images.length > 0 && (
                      <div className={`grid gap-2 mb-4 ${
                        review.images.length === 1 ? 'grid-cols-1' :
                        review.images.length === 2 ? 'grid-cols-2' :
                        'grid-cols-3'
                      }`}>
                        {review.images.map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`${review.productName} 리뷰 사진 ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Review Content */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-4">
                      {review.content}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        도움됨 {review.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                        댓글 {review.replies}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pagination */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  이전
                </Button>
                <Button size="sm" className="bg-blue-600">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">4</Button>
                <Button variant="outline" size="sm">5</Button>
                <Button variant="outline" size="sm">
                  다음
                </Button>
              </div>
            </div>
          </div>
        </section>

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
              <Button size="lg" variant="secondary">
                리뷰 작성하기
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-yellow-600">
                <Link href="/guide">주문 가이드 보기</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StripBannerProvider>
  );
}
