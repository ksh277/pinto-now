import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, Truck, Star } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

const copy = {
  title: '의류 굿즈',
  subtitle: '편안하고 스타일리시한 맞춤 의류',
  description: '고품질 원단과 정밀한 프린팅으로 제작하는 개성 있는 의류 제품들을 만나보세요.',
  usp: [
    { icon: '👕', title: '프리미엄 원단', desc: '부드럽고 내구성 있는 고품질 면 소재' },
    { icon: '🎨', title: '다양한 프린팅', desc: '실크스크린, DTG, DTF 등 맞춤 프린팅' },
    { icon: '📏', title: '풀사이즈', desc: 'XS부터 3XL까지 다양한 사이즈' }
  ],
  cta: {
    primary: '의류 제작하기',
    secondary: '대량 주문 문의'
  },
  faq: [
    {
      question: '의류의 최소 주문 수량은 얼마인가요?',
      answer: '티셔츠는 최소 20장부터 주문 가능합니다. 후드티, 맨투맨은 최소 10장부터 가능합니다.'
    },
    {
      question: '어떤 원단을 사용하나요?',
      answer: '100% 면, 면-폴리 혼방, 드라이핏 등 용도에 맞는 다양한 원단을 제공합니다.'
    },
    {
      question: '프린팅 방식은 어떤 것이 있나요?',
      answer: '실크스크린, DTG(Direct to Garment), DTF, 자수 등 다양한 방식으로 제작 가능합니다.'
    },
    {
      question: '사이즈는 어떻게 확인하나요?',
      answer: '상세한 사이즈표를 제공하며, 필요시 샘플 제작을 통해 사이즈를 확인할 수 있습니다.'
    }
  ],
  info: [
    '전국 무료배송 (10만원 이상 주문 시)',
    '제작 기간: 10-14 영업일',
    '대량 주문 할인: 100장 이상 25% 할인'
  ]
};

const products = [
  {
    id: 1,
    name: '기본 반팔 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['반팔', '기본'],
    price: 8000
  },
  {
    id: 2,
    name: '긴팔 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['긴팔', '캐주얼'],
    price: 12000
  },
  {
    id: 3,
    name: '후드 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['후드', '겨울'],
    price: 18000
  },
  {
    id: 4,
    name: '맨투맨 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['맨투맨', '기본'],
    price: 15000
  },
  {
    id: 5,
    name: '폴로 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['폴로', '정장'],
    price: 16000
  },
  {
    id: 6,
    name: '나시 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['나시', '여름'],
    price: 6000
  },
  {
    id: 7,
    name: '드라이핏 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['드라이핏', '스포츠'],
    price: 14000
  },
  {
    id: 8,
    name: '집업 후드',
    image: "/components/img/placeholder-product.jpg",
    tags: ['집업', '아우터'],
    price: 22000
  }
];

export const metadata = {
  title: '의류 굿즈 제작 | 맞춤 티셔츠, 후드티 제작 | PINTO',
  description: '고품질 원단과 정밀 프린팅으로 제작하는 맞춤 의류. 티셔츠, 후드티, 맨투맨 등 다양한 의류를 합리적인 가격에 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/clothing-goods'
  },
  openGraph: {
    title: '의류 굿즈 제작 | PINTO',
    description: '프리미엄 원단과 다양한 프린팅 방식으로 제작하는 개성 있는 맞춤 의류. 풀사이즈 제공.',
    url: 'https://pinto.co.kr/clothing-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '의류 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '의류 굿즈 제작 | PINTO',
    description: '편안하고 스타일리시한 맞춤 의류를 합리적인 가격에 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default function ClothingGoodsPage() {
  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
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
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
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
                    alt="의류 굿즈 모음"
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
                인기 의류 굿즈
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 의류 제품들을 확인해보세요
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
                      <span className="text-lg font-bold text-orange-600">
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
        <section className="py-12 bg-orange-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[0]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Package className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[1]}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {copy.info[2]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 맞춤 의류를 제작해보세요
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              전문 상담팀이 최적의 의류 제품을 추천해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                제작 상담받기
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-orange-600">
                <Link href="/guide">제작 가이드 보기</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StripBannerProvider>
  );
}