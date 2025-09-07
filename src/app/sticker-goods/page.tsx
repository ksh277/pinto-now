import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import { getProductsByCategory, getProductStats } from '@/lib/api';

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

export default async function StickerGoodsPage() {
  let stickerProducts = [];
  let stats = {};

  try {
    // Fetch sticker-related products (using acrylic category as fallback)
    const products = await getProductsByCategory('아크릴');
    stats = await getProductStats(products.map(p => p.id));

    // Filter for sticker-like products or take first 6
    stickerProducts = products.slice(0, 6);
  } catch (error) {
    console.warn('Failed to fetch products for sticker page during build:', error);
    // Use fallback static data for build
    stickerProducts = [
      { id: '1', nameKo: '비닐 스티커', imageUrl: '/images/sample-banner1.svg', priceKrw: 500 },
      { id: '2', nameKo: '투명 스티커', imageUrl: '/images/sample-banner2.svg', priceKrw: 800 },
      { id: '3', nameKo: '홀로그램 스티커', imageUrl: '/images/sample-banner3.svg', priceKrw: 1200 },
      { id: '4', nameKo: '방수 스티커', imageUrl: '/images/sample-banner4.svg', priceKrw: 1000 },
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
                스티커
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 스티커 제품들을 확인해보세요
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stickerProducts.map((product) => (
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
                        스티커
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        맞춤제작
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
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