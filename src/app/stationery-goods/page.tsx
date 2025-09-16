import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, Truck, Star } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import { getProductsByCategory, getProductStats } from '@/lib/api';

export const dynamic = 'force-dynamic';

const copy = {
  title: '문구/오피스 굿즈',
  subtitle: '업무와 학습을 위한 실용적인 맞춤 문구',
  description: '일상에서 유용하게 사용할 수 있는 고품질 문구 및 오피스 용품을 맞춤 제작합니다.',
  usp: [
    { icon: '✏️', title: '실용성', desc: '일상에서 유용하게 사용되는 실용적인 제품' },
    { icon: '🎨', title: '맞춤 디자인', desc: '브랜드와 개성을 반영한 맞춤 디자인' },
    { icon: '💼', title: '업무 효율', desc: '업무와 학습 효율을 높이는 기능성' }
  ],
  cta: {
    primary: '문구 제작하기'
  },
  faq: [
    {
      question: '문구류의 최소 주문 수량은 얼마인가요?',
      answer: '제품에 따라 다르지만 일반적으로 50개부터 주문 가능합니다. 노트는 20권부터 가능합니다.'
    },
    {
      question: '어떤 제품들을 제작할 수 있나요?',
      answer: '노트, 펜, 마우스패드, 파일, 스티키노트, 달력, 플래너 등 다양한 문구 제품을 제작합니다.'
    },
    {
      question: '인쇄 품질은 어떤가요?',
      answer: '오프셋 인쇄와 디지털 인쇄를 통해 선명하고 정확한 컬러를 구현합니다.'
    },
    {
      question: '특수 가공이 가능한가요?',
      answer: '코팅, 박, 형압, 재단 등 다양한 후가공을 통해 고급스러운 마감을 제공합니다.'
    }
  ],
  info: [
    '전국 무료배송 (5만원 이상 주문 시)',
    '제작 기간: 5-7 영업일',
    '대량 주문 할인: 200개 이상 20% 할인'
  ]
};


export const metadata = {
  title: '문구/오피스 굿즈 제작 | 맞춤 노트, 펜, 마우스패드 | PINTO',
  description: '업무와 학습을 위한 실용적인 맞춤 문구 제작. 노트, 펜, 마우스패드, 파일 등 다양한 문구용품을 고품질로 제작합니다.',
  alternates: {
    canonical: 'https://pinto.co.kr/stationery-goods'
  },
  openGraph: {
    title: '문구/오피스 굿즈 제작 | PINTO',
    description: '실용적이고 개성 있는 맞춤 문구 제품. 일상에서 유용하게 사용할 수 있는 고품질 문구용품을 제작하세요.',
    url: 'https://pinto.co.kr/stationery-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '문구/오피스 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '문구/오피스 굿즈 제작 | PINTO',
    description: '업무 효율을 높이는 맞춤 문구 제품을 합리적인 가격에 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default async function StationeryGoodsPage() {
  let stationeryProducts: any[] = [];
  let stats: Record<string, { likeCount: number; reviewCount: number }> = {};

  try {
    // Fetch stationery-related products
    const products = await getProductsByCategory('문구/오피스');
    stats = await getProductStats(products.map(p => p.id));

    // Take all stationery products
    stationeryProducts = products;
  } catch (error) {
    console.warn('Failed to fetch products for stationery page during build:', error);
    // No fallback data - show empty list if API fails
    stationeryProducts = [];
    stats = {};
  }
  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        

        {/* Header */}
        <section className="py-12 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                문구/오피스 굿즈
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                맞춤 노트, 펜, 마우스패드 등 다양한 문구용품들을 확인해보세요
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="px-8 md:px-16">
            <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
              {stationeryProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl border-2 border-gray-100 p-3 md:p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative w-[calc(100vw-3rem)] max-w-[350px] md:max-w-none md:w-auto flex-shrink-0 md:flex-shrink flex md:block gap-4 md:gap-0">
                    <div className="relative w-24 h-24 md:w-full md:h-80 flex-shrink-0 md:mb-3 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                      <Image
                        src={product.imageUrl || '/components/img/placeholder-product.jpg'}
                        alt={product.nameKo || 'Product'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {/* 호버 시 오버레이 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {product.nameKo}
                      </h3>

                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1 mb-1 md:mb-2">
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            문구
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            오피스
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-1 md:pt-2 border-t border-gray-100">
                        <span className="font-bold text-blue-600 text-base md:text-lg">
                          ~{product.priceKrw?.toLocaleString()}원
                        </span>
                        <span className="text-xs text-gray-500 ml-1">부터</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                자주 묻는 질문
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {copy.faq.map((item, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-indigo-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[0]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Package className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[1]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[2]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-cyan-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 맞춤 문구를 제작해보세요
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              전문 상담팀이 최적의 문구 제품을 추천해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                제작 상담받기
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-indigo-600">
                <Link href="/guide">제작 가이드 보기</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StripBannerProvider>
  );
}