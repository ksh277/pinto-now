'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, Truck, Star, Phone, Mail } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import type { CategoryMapping } from '@/lib/category-mappings';

interface CategoryPageTemplateProps {
  mapping: CategoryMapping;
  products?: Array<{
    id: string;
    name: string;
    tags: string[];
    price: number;
    image: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  processSteps?: Array<{
    step: number;
    title: string;
    description: string;
  }>;
}

const defaultProducts = [
  { id: 'sample-1', name: '샘플 상품 1', tags: ['인기', '추천'], price: 5000, image: '/components/img/placeholder-product.jpg' },
  { id: 'sample-2', name: '샘플 상품 2', tags: ['신상', '할인'], price: 8000, image: '/components/img/placeholder-product.jpg' },
  { id: 'sample-3', name: '샘플 상품 3', tags: ['베스트'], price: 12000, image: '/components/img/placeholder-product.jpg' },
  { id: 'sample-4', name: '샘플 상품 4', tags: ['한정'], price: 15000, image: '/components/img/placeholder-product.jpg' },
  { id: 'sample-5', name: '샘플 상품 5', tags: ['프리미엄'], price: 20000, image: '/components/img/placeholder-product.jpg' },
  { id: 'sample-6', name: '샘플 상품 6', tags: ['맞춤'], price: 25000, image: '/components/img/placeholder-product.jpg' },
];

const defaultFaq = [
  {
    question: '최소 주문 수량은 얼마인가요?',
    answer: '상품에 따라 다르지만 일반적으로 10개부터 주문 가능합니다. 자세한 내용은 각 상품 페이지를 확인해주세요.'
  },
  {
    question: '제작 기간은 얼마나 걸리나요?',
    answer: '디자인 확정 후 7-10 영업일이 소요됩니다. 급한 주문의 경우 추가 비용으로 단축 제작 가능합니다.'
  },
  {
    question: '배송비는 얼마인가요?',
    answer: '전국 무료배송입니다. (5만원 이상 주문 시) 5만원 미만 주문 시 배송비 3,000원이 부과됩니다.'
  },
  {
    question: '샘플 확인이 가능한가요?',
    answer: '유료 샘플 제작 서비스를 제공합니다. 샘플 비용은 본 주문 시 차감됩니다.'
  }
];

export default function CategoryPageTemplate({ 
  mapping, 
  products = defaultProducts, 
  faq = defaultFaq,
  processSteps 
}: CategoryPageTemplateProps) {
  const isServicePage = mapping.type === 'service';
  const isBoardPage = mapping.type === 'board';

  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  {mapping.categoryKo}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                  {mapping.subtitle}
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                  {mapping.description}
                </p>
                
                {/* USP Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {mapping.usp.map((item, index) => (
                    <div key={index} className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {isServicePage ? (
                    <>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        상담 신청하기
                      </Button>
                      <Button variant="outline" size="lg">
                        서비스 자료 받기
                      </Button>
                    </>
                  ) : isBoardPage ? (
                    <>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        리뷰 작성하기
                      </Button>
                      <Button variant="outline" size="lg">
                        리뷰 둘러보기
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                        <a href="/editor">제품 제작하기</a>
                      </Button>
                      <Button variant="outline" size="lg">
                        대량 주문 문의
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <Image
                    src={mapping.heroImagePath}
                    alt={`${mapping.categoryKo} 메인 이미지`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid - Only for category pages */}
        {!isServicePage && !isBoardPage && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  인기 {mapping.categoryKo}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  다양한 제품들을 확인해보세요
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
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
                        <Link href={`/product/${product.id}`} className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
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
        )}

        {/* Process Steps - For service pages */}
        {isServicePage && processSteps && (
          <section className="py-16 md:py-24 bg-white dark:bg-slate-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  서비스 진행 과정
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  체계적이고 전문적인 서비스 프로세스
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step) => (
                  <div key={step.step} className="text-center">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                자주 묻는 질문
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faq.map((item, index) => (
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

        {/* Contact Section - For service pages */}
        {isServicePage && (
          <section className="py-16 bg-blue-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                  전문 상담을 받아보세요
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">전화 상담</p>
                      <p className="text-gray-600 dark:text-gray-400">1588-1234</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">이메일 문의</p>
                      <p className="text-gray-600 dark:text-gray-400">info@pinto.co.kr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Info Section - For category pages */}
        {!isServicePage && !isBoardPage && (
          <section className="py-12 bg-blue-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Truck className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      전국 무료배송 (5만원 이상 주문 시)
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Package className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      제작 기간: 7-10 영업일
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      대량 주문 할인: 100개 이상 20% 할인
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 {mapping.categoryKo}를 {isServicePage ? '신청' : '제작'}해보세요
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              전문 상담팀이 최적의 {isServicePage ? '서비스' : '제품'}을 추천해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                {isServicePage ? '상담 신청하기' : '제작 상담받기'}
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