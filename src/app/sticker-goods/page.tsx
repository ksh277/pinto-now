import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, Truck, Star } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

const copy = {
  title: '스티커 굿즈',
  subtitle: '다양한 용도로 활용 가능한 맞춤 스티커',
  description: '내구성과 접착력이 뛰어난 고품질 스티커로 나만의 개성을 표현하세요.',
  usp: [
    { icon: '🎨', title: '고해상도 인쇄', desc: '선명하고 생생한 컬러로 정밀 인쇄' },
    { icon: '💧', title: '방수 코팅', desc: '물과 자외선에 강한 내구성 스티커' },
    { icon: '✂️', title: '다양한 커팅', desc: '원형, 사각, 특수 모양 맞춤 커팅' }
  ],
  cta: {
    primary: '스티커 제작하기',
    secondary: '대량 주문 문의'
  },
  faq: [
    {
      question: '스티커의 최소 주문 수량은 얼마인가요?',
      answer: '스티커는 최소 50매부터 주문 가능합니다. 수량이 많을수록 단가가 저렴해집니다.'
    },
    {
      question: '어떤 소재의 스티커를 사용하나요?',
      answer: '용도에 따라 일반 비닐, 투명 비닐, 홀로그램, 유포지 등 다양한 소재를 선택할 수 있습니다.'
    },
    {
      question: '제작 기간은 얼마나 걸리나요?',
      answer: '디자인 확정 후 3-5 영업일이 소요됩니다. 급한 주문의 경우 당일 제작도 가능합니다.'
    },
    {
      question: '스티커 크기는 어떻게 정하나요?',
      answer: '최소 1cm부터 최대 30cm까지 제작 가능하며, 원하는 크기로 맞춤 제작합니다.'
    }
  ],
  info: [
    '전국 무료배송 (3만원 이상 주문 시)',
    '제작 기간: 3-5 영업일',
    '대량 주문 할인: 500매 이상 30% 할인'
  ]
};

const products = [
  {
    id: 1,
    name: '비닐 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['비닐', '일반'],
    price: 500
  },
  {
    id: 2,
    name: '투명 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['투명', '프리미엄'],
    price: 800
  },
  {
    id: 3,
    name: '홀로그램 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['홀로그램', '특수'],
    price: 1200
  },
  {
    id: 4,
    name: '유포지 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['유포지', '고급'],
    price: 1000
  },
  {
    id: 5,
    name: '원형 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['원형', '커팅'],
    price: 600
  },
  {
    id: 6,
    name: '사각 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['사각', '기본'],
    price: 550
  },
  {
    id: 7,
    name: '특수 커팅 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['특수커팅', '맞춤'],
    price: 1500
  },
  {
    id: 8,
    name: '라벨 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['라벨', '업무용'],
    price: 700
  }
];

export const metadata = {
  title: '스티커 굿즈 제작 | 다양한 용도의 맞춤 스티커 | PINTO',
  description: '고품질 스티커 제작 서비스. 비닐, 투명, 홀로그램, 유포지 등 다양한 소재와 원형, 사각, 특수 커팅으로 나만의 스티커를 만들어보세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/sticker-goods'
  },
  openGraph: {
    title: '스티커 굿즈 제작 | PINTO',
    description: '내구성과 접착력이 뛰어난 고품질 스티커. 다양한 소재와 커팅 옵션으로 개성 있는 스티커를 제작하세요.',
    url: 'https://pinto.co.kr/sticker-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '스티커 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '스티커 굿즈 제작 | PINTO',
    description: '방수 코팅과 고해상도 인쇄로 오래도록 선명한 맞춤 스티커를 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default function StickerGoodsPage() {
  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  {copy.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                  {copy.subtitle}
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                  {copy.description}
                </p>
                
                {/* USP Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {copy.usp.map((item, index) => (
                    <div key={index} className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    {copy.cta.primary}
                  </Button>
                  <Button variant="outline" size="lg">
                    {copy.cta.secondary}
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <Image
                    src="/components/img/placeholder-product.jpg"
                    alt="스티커 굿즈 모음"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                인기 스티커 굿즈
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 스티커 제품들을 확인해보세요
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
                      <span className="text-lg font-bold text-green-600">
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
        <section className="py-12 bg-green-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[0]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Package className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[1]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[2]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-yellow-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 스티커를 제작해보세요
            </h2>
            <p className="text-xl text-green-100 mb-8">
              전문 상담팀이 최적의 스티커를 추천해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                제작 상담받기
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                <Link href="/guide">제작 가이드 보기</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StripBannerProvider>
  );
}