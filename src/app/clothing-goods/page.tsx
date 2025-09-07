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
    // Fetch clothing-related products (using acrylic category as fallback)
    const products = await getProductsByCategory('아크릴');
    stats = await getProductStats(products.map(p => p.id));
    
    // Filter for clothing-like products or take first 6
    clothingProducts = products.slice(0, 6);
  } catch (error) {
    console.warn('Failed to fetch products for clothing page during build:', error);
    // Use fallback static data for build
    clothingProducts = [
      { id: '1', nameKo: '반팔 티셔츠', imageUrl: '/images/sample-banner1.svg', priceKrw: 8000 },
      { id: '2', nameKo: '긴팔 티셔츠', imageUrl: '/images/sample-banner2.svg', priceKrw: 12000 },
      { id: '3', nameKo: '후드티', imageUrl: '/images/sample-banner3.svg', priceKrw: 18000 },
      { id: '4', nameKo: '맨투맨', imageUrl: '/images/sample-banner4.svg', priceKrw: 15000 },
    ];
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
                의류
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 의류 제품들을 확인해보세요
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clothingProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.imageUrl || '/images/sample-banner1.svg'}
                      alt={product.nameKo || 'Product'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {product.nameKo}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        의류
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        프린팅
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        {product.priceKrw?.toLocaleString()}원~
                      </span>
                      <div className="text-xs text-gray-500">
                        ♡ {stats[product.id]?.likeCount || 0} 리뷰 {stats[product.id]?.reviewCount || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </StripBannerProvider>
  );
}