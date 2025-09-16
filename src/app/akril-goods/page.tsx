import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, Truck, Star } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import { availableProducts } from '@/lib/pricing-data';

const copy = {
  title: '아크릴 굿즈',
  subtitle: '투명하고 견고한 프리미엄 아크릴 제품',
  description: '내구성이 뛰어난 아크릴 소재로 제작하는 다양한 굿즈들을 만나보세요.',
  usp: [
    { icon: '✨', title: '고품질 아크릴', desc: '투명도 높은 프리미엄 아크릴 사용' },
    { icon: '🎨', title: '정밀 인쇄', desc: 'UV 프린팅으로 선명하고 내구성 있는 인쇄' },
    { icon: '🛡️', title: '내구성', desc: '긁힘과 충격에 강한 견고한 제품' }
  ],
  cta: {
    primary: '아크릴 굿즈 제작하기'
  },
  faq: [
    {
      question: '아크릴 굿즈의 최소 주문 수량은 얼마인가요?',
      answer: '아크릴 굿즈는 최소 10개부터 주문 가능합니다. 수량이 많을수록 단가가 저렴해집니다.'
    },
    {
      question: '인쇄 품질은 어떤가요?',
      answer: 'UV 프린팅 방식을 사용하여 색상이 선명하고 오래 지속됩니다. 투명 아크릴에도 완벽한 인쇄가 가능합니다.'
    },
    {
      question: '제작 기간은 얼마나 걸리나요?',
      answer: '디자인 확정 후 7-10 영업일이 소요됩니다. 급한 주문의 경우 추가 비용으로 단축 제작 가능합니다.'
    },
    {
      question: '아크릴 두께는 어떻게 되나요?',
      answer: '일반적으로 3mm, 5mm 두께를 사용하며, 제품에 따라 2mm~10mm까지 선택 가능합니다.'
    }
  ],
  info: [
    '전국 무료배송 (5만원 이상 주문 시)',
    '제작 기간: 7-10 영업일',
    '대량 주문 할인: 100개 이상 20% 할인'
  ]
};

// pricing-data.ts의 availableProducts를 기반으로 제품 목록 생성
// 실제 데이터베이스 ID와 매핑 (1-9, pricing-data.ts와 일치)
const productIdMapping = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const products = availableProducts.map((product, index) => ({
  id: productIdMapping[index],
  name: product.name,
  image: "/components/img/placeholder-product.jpg", // 기본 이미지 사용
  tags: product.name.split(' ').slice(0, 2), // 이름에서 태그 생성
  price: product.pricingTiers[0].prices[Object.keys(product.pricingTiers[0].prices)[0]] || 0
}));

export const metadata = {
  title: '아크릴 굿즈 제작 | 투명하고 견고한 프리미엄 아크릴 제품 | PINTO',
  description: '고품질 아크릴 소재로 제작하는 다양한 굿즈들. 키링, 스탠디, 북마크, 포토프레임 등 내구성 뛰어난 아크릴 제품을 합리적인 가격에 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/akril-goods'
  },
  openGraph: {
    title: '아크릴 굿즈 제작 | PINTO',
    description: '투명도 높은 프리미엄 아크릴로 제작하는 견고하고 아름다운 굿즈. UV 프린팅으로 선명한 인쇄품질을 제공합니다.',
    url: 'https://pinto.co.kr/akril-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '아크릴 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '아크릴 굿즈 제작 | PINTO',
    description: '투명하고 견고한 프리미엄 아크릴 제품을 합리적인 가격에 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default function AkrilGoodsPage() {
  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

        {/* Header */}
        <section className="py-12 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                아크릴 굿즈
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                투명하고 견고한 프리미엄 아크릴 제품들을 확인해보세요
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="px-8 md:px-16">
            <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl border-2 border-gray-100 p-3 md:p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative w-[calc(100vw-3rem)] max-w-[350px] md:max-w-none md:w-auto flex-shrink-0 md:flex-shrink flex md:block gap-4 md:gap-0">
                    <div className="relative w-24 h-24 md:w-full md:h-80 flex-shrink-0 md:mb-3 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {/* 호버 시 오버레이 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {product.name}
                      </h3>

                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1 mb-1 md:mb-2">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1 md:pt-2 border-t border-gray-100">
                        <span className="font-bold text-blue-600 text-base md:text-lg">
                          ~{product.price.toLocaleString()}원
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
          <div className="px-8 md:px-16">
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
        <section className="py-12 bg-blue-50 dark:bg-slate-900">
          <div className="px-8 md:px-16">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[0]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Package className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[1]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[2]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="px-8 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 아크릴 굿즈를 제작해보세요
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              전문 상담팀이 최적의 제품을 추천해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                제작 상담받기
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Link href="/guide">제작 가이드 보기</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StripBannerProvider>
  );
}