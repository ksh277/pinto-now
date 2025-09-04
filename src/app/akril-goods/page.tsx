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
    primary: '아크릴 굿즈 제작하기',
    secondary: '대량 주문 문의'
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
const products = availableProducts.map((product, index) => ({
  id: index + 1,
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
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
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
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
                    alt="아크릴 굿즈 모음"
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
                인기 아크릴 굿즈
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 아크릴 제품들을 확인해보세요
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
                      <span className="text-lg font-bold text-blue-600">
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
        <section className="py-12 bg-blue-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
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
          <div className="container mx-auto px-4 text-center">
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