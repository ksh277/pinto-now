import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

const products = [
  {
    id: 1,
    name: '비닐 스티커 - 5cm',
    image: "/components/img/placeholder-product.jpg",
    tags: ['비닐', '5cm'],
    price: 500
  },
  {
    id: 2,
    name: '투명 스티커 - 3cm',
    image: "/components/img/placeholder-product.jpg",
    tags: ['투명', '3cm'],
    price: 800
  },
  {
    id: 3,
    name: '홀로그램 스티커 - 원형',
    image: "/components/img/placeholder-product.jpg",
    tags: ['홀로그램', '원형'],
    price: 1200
  },
  {
    id: 4,
    name: '방수 스티커 - 사각',
    image: "/components/img/placeholder-product.jpg",
    tags: ['방수', '사각'],
    price: 1000
  },
  {
    id: 5,
    name: '라벨 스티커 - 10cm',
    image: "/components/img/placeholder-product.jpg",
    tags: ['라벨', '10cm'],
    price: 700
  },
  {
    id: 6,
    name: '특수 커팅 스티커',
    image: "/components/img/placeholder-product.jpg",
    tags: ['특수커팅', '맞춤'],
    price: 1500
  }
];

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

export default function StickerGoodsPage() {
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
                      <span className="text-lg font-bold text-green-600">
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
      </div>
    </StripBannerProvider>
  );
}