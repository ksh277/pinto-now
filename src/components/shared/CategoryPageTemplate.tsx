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

        {/* Products Grid - Only for category pages */}
        {!isServicePage && !isBoardPage && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {products.slice(0, 8).map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
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


      </div>
    </StripBannerProvider>
  );
}