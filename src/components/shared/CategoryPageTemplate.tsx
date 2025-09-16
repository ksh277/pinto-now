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
  const displayProducts = mapping.sampleProducts || products;

  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

        {/* Header */}
        <section className="py-12 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {mapping.categoryKo}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {mapping.description || `다양한 ${mapping.categoryKo} 제품들을 확인해보세요`}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="px-8 md:px-16">
            {/* 주간 랭킹 카드와 동일한 스타일 */}
            <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
              {displayProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
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

      </div>
    </StripBannerProvider>
  );
}