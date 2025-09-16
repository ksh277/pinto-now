import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import { getProductsByCategory, getProductStats } from '@/lib/api';

export const dynamic = 'force-dynamic';

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
  let stats: Record<string, { likeCount: number; reviewCount: number }> = {};

  try {
    // Fetch sticker-related products
    const products = await getProductsByCategory('스티커');
    stats = await getProductStats(products.map(p => p.id));

    // Take all sticker products
    stickerProducts = products;
  } catch (error) {
    console.warn('Failed to fetch products for sticker page during build:', error);
    // No fallback data - show empty list if API fails
    stickerProducts = [];
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
                스티커 굿즈
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 용도의 맞춤 스티커 제품들을 확인해보세요
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="px-8 md:px-16">
            <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
              {stickerProducts.map((product) => (
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
                            스티커
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            맞춤제작
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