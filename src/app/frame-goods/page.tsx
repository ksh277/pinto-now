import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, Truck, Star } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

const copy = {
  title: '액자 굿즈',
  subtitle: '소중한 추억을 담는 프리미엄 액자',
  description: '고품질 소재와 정밀 제작으로 만든 다양한 액자 제품으로 특별한 순간을 보관하세요.',
  usp: [
    { icon: '🖼️', title: '다양한 소재', desc: '우드, 아크릴, 메탈 등 다양한 소재' },
    { icon: '📐', title: '맞춤 사이즈', desc: '원하는 크기로 정확한 맞춤 제작' },
    { icon: '✨', title: '고급 마감', desc: 'UV 코팅과 정밀 가공으로 완벽 마감' }
  ],
  cta: {
    primary: '액자 제작하기',
    secondary: '대량 주문 문의'
  },
  faq: [
    {
      question: '액자의 최소 주문 수량은 얼마인가요?',
      answer: '액자는 최소 5개부터 주문 가능합니다. 종류와 사이즈에 따라 다를 수 있습니다.'
    },
    {
      question: '어떤 소재로 제작하나요?',
      answer: '우드 프레임, 아크릴 프레임, 메탈 프레임 등 다양한 소재를 선택할 수 있습니다.'
    },
    {
      question: '사이즈는 어떻게 정하나요?',
      answer: '표준 사이즈부터 맞춤 사이즈까지 제작 가능합니다. 원하는 크기를 알려주시면 됩니다.'
    },
    {
      question: '보호 유리는 포함되나요?',
      answer: '기본적으로 아크릴 보호판이 포함되며, 강화유리로 업그레이드도 가능합니다.'
    }
  ],
  info: [
    '전국 무료배송 (7만원 이상 주문 시)',
    '제작 기간: 7-10 영업일',
    '대량 주문 할인: 50개 이상 20% 할인'
  ]
};

const products = [
  {
    id: 1,
    name: '우드 액자',
    image: "/components/img/placeholder-product.jpg",
    tags: ['우드', '클래식'],
    price: 15000
  },
  {
    id: 2,
    name: '아크릴 액자',
    image: "/components/img/placeholder-product.jpg",
    tags: ['아크릴', '모던'],
    price: 12000
  },
  {
    id: 3,
    name: '메탈 액자',
    image: "/components/img/placeholder-product.jpg",
    tags: ['메탈', '고급'],
    price: 18000
  },
  {
    id: 4,
    name: '포토 프레임',
    image: "/components/img/placeholder-product.jpg",
    tags: ['포토', '가족'],
    price: 10000
  },
  {
    id: 5,
    name: '디지털 액자',
    image: "/components/img/placeholder-product.jpg",
    tags: ['디지털', '스마트'],
    price: 35000
  },
  {
    id: 6,
    name: '콜라주 액자',
    image: "/components/img/placeholder-product.jpg",
    tags: ['콜라주', '다중'],
    price: 20000
  },
  {
    id: 7,
    name: '스탠딩 액자',
    image: "/components/img/placeholder-product.jpg",
    tags: ['스탠딩', '책상'],
    price: 8000
  },
  {
    id: 8,
    name: '벽걸이 액자',
    image: "/components/img/placeholder-product.jpg",
    tags: ['벽걸이', '인테리어'],
    price: 13000
  }
];

export const metadata = {
  title: '액자 굿즈 제작 | 맞춤 포토프레임, 액자 제작 | PINTO',
  description: '고품질 소재로 제작하는 맞춤 액자. 우드, 아크릴, 메탈 프레임 등 다양한 소재와 사이즈로 소중한 추억을 보관하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/frame-goods'
  },
  openGraph: {
    title: '액자 굿즈 제작 | PINTO',
    description: '다양한 소재와 맞춤 사이즈로 제작하는 프리미엄 액자. 고급 마감으로 완성합니다.',
    url: 'https://pinto.co.kr/frame-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '액자 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '액자 굿즈 제작 | PINTO',
    description: '소중한 추억을 담는 프리미엄 맞춤 액자를 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default function FrameGoodsPage() {
  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
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
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
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
                    alt="액자 굿즈 모음"
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
                인기 액자 굿즈
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 액자 제품들을 확인해보세요
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
                      <span className="text-lg font-bold text-purple-600">
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
        <section className="py-12 bg-purple-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[0]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Package className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[1]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[2]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 맞춤 액자를 제작해보세요
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              전문 상담팀이 최적의 액자 제품을 추천해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                제작 상담받기
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                <Link href="/guide">제작 가이드 보기</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StripBannerProvider>
  );
}