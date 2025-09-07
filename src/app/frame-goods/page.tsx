import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

const products = [
  {
    id: 1,
    name: '우드 액자 - A4',
    image: "/components/img/placeholder-product.jpg",
    tags: ['우드', 'A4'],
    price: 15000
  },
  {
    id: 2,
    name: '아크릴 액자 - B5',
    image: "/components/img/placeholder-product.jpg",
    tags: ['아크릴', 'B5'],
    price: 12000
  },
  {
    id: 3,
    name: '메탈 액자 - A3',
    image: "/components/img/placeholder-product.jpg",
    tags: ['메탈', 'A3'],
    price: 18000
  },
  {
    id: 4,
    name: '포토 프레임 - 5x7',
    image: "/components/img/placeholder-product.jpg",
    tags: ['포토', '5x7'],
    price: 10000
  },
  {
    id: 5,
    name: '스탠딩 액자 - 탁상용',
    image: "/components/img/placeholder-product.jpg",
    tags: ['스탠딩', '탁상'],
    price: 8000
  },
  {
    id: 6,
    name: '벽걸이 액자 - A2',
    image: "/components/img/placeholder-product.jpg",
    tags: ['벽걸이', 'A2'],
    price: 25000
  }
];

export const metadata = {
  title: '액자 굿즈 제작 | 맞춤 포토프레임, 액자 제작 | PINTO',
  description: '고품질 소재로 제작하는 맞춤 액자. 우드, 아크릴, 메탈 프레임 등 다양한 소재와 사이즈로 소중한 추억을 보관하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/frame-goods'
  },
  openGraph: {
    title: '액자 굿즈 제작 | PINTO',
    description: '다양한 소재와 맞춤 사이즈로 제작하는 프리미엄 액자. 고급 마감으로 완성합니다.',
    url: 'https://pinto.co.kr/frame-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '액자 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '액자 굿즈 제작 | PINTO',
    description: '소중한 추억을 담는 프리미엄 맞춤 액자를 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default function FrameGoodsPage() {
  return (
    <StripBannerProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        
        {/* Header */}
        <section className="py-12 bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                액자
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                다양한 액자 제품들을 확인해보세요
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
                      <span className="text-lg font-bold text-purple-600">
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