import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, Truck, Star } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

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

const products = [
  {
    id: 1,
    name: '맞춤 노트',
    image: "/components/img/placeholder-product.jpg",
    tags: ['노트', '기록'],
    price: 3000
  },
  {
    id: 2,
    name: '볼펜/샤프',
    image: "/components/img/placeholder-product.jpg",
    tags: ['펜', '필기'],
    price: 2000
  },
  {
    id: 3,
    name: '마우스패드',
    image: "/components/img/placeholder-product.jpg",
    tags: ['마우스패드', 'PC'],
    price: 5000
  },
  {
    id: 4,
    name: '클리어파일',
    image: "/components/img/placeholder-product.jpg",
    tags: ['파일', '정리'],
    price: 1500
  },
  {
    id: 5,
    name: '스티키노트',
    image: "/components/img/placeholder-product.jpg",
    tags: ['메모', '접착'],
    price: 1000
  },
  {
    id: 6,
    name: '데스크 달력',
    image: "/components/img/placeholder-product.jpg",
    tags: ['달력', '일정'],
    price: 4000
  },
  {
    id: 7,
    name: '플래너',
    image: "/components/img/placeholder-product.jpg",
    tags: ['플래너', '계획'],
    price: 8000
  },
  {
    id: 8,
    name: '북마크',
    image: "/components/img/placeholder-product.jpg",
    tags: ['북마크', '독서'],
    price: 800
  }
];

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

export default function StationeryGoodsPage() {
  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        

        {/* Products Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                인기 문구/오피스 굿즈
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 문구 제품들을 확인해보세요
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">
                        {product.price.toLocaleString()}원~
                      </span>
                      <Link href={`/products/${product.id}`} className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                        자세히 보기
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
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