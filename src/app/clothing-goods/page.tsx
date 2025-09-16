import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import { getProductsByCategory, getProductStats } from '@/lib/api';

export const dynamic = 'force-dynamic';

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

export default async function ClothingGoodsPage() {
  let clothingProducts = [];
  let stats: Record<string, { likeCount: number; reviewCount: number }> = {};

  try {
    // Fetch clothing-related products
    const products = await getProductsByCategory('의류');
    stats = await getProductStats(products.map(p => p.id));

    // Take all clothing products
    clothingProducts = products;
  } catch (error) {
    console.warn('Failed to fetch products for clothing page during build:', error);
    // No fallback data - show empty list if API fails
    clothingProducts = [];
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
                의류 굿즈
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                맞춤 티셔츠, 후드티 등 다양한 의류 제품들을 확인해보세요
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="px-8 md:px-16">
            <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
              {clothingProducts.map((product) => (
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
                            의류
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            프린팅
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
      </div>
    </StripBannerProvider>
  );
}