import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

const products = [
  {
    id: 1,
    name: '반팔 티셔츠 - 100% 면',
    image: "/components/img/placeholder-product.jpg",
    tags: ['반팔', '100% 면'],
    price: 8000
  },
  {
    id: 2,
    name: '긴팔 티셔츠 - 혹방',
    image: "/components/img/placeholder-product.jpg",
    tags: ['긴팔', '혹방'],
    price: 12000
  },
  {
    id: 3,
    name: '후드티 - 집업',
    image: "/components/img/placeholder-product.jpg",
    tags: ['후드', '집업'],
    price: 18000
  },
  {
    id: 4,
    name: '맨투맨 - 기본',
    image: "/components/img/placeholder-product.jpg",
    tags: ['맨투맨', '기본'],
    price: 15000
  },
  {
    id: 5,
    name: '드라이핏 티셔츠',
    image: "/components/img/placeholder-product.jpg",
    tags: ['드라이핏', '스포츠'],
    price: 14000
  },
  {
    id: 6,
    name: '폴로 셔츠 - 비즈니스',
    image: "/components/img/placeholder-product.jpg",
    tags: ['폴로', '비즈니스'],
    price: 16000
  }
];

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

export default function ClothingGoodsPage() {
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
                      <span className="text-lg font-bold text-orange-600">
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