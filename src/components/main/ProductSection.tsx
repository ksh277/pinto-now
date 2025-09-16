"use client";
import { useState, useEffect } from 'react';
import { useProductContext } from '@/contexts/product-context';
import ProductShelfCarousel from '@/components/ProductShelfCarousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';

type ProductShelfBanner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  products: Product[];
};

async function fetchProductShelfBanners(): Promise<ProductShelfBanner[]> {
  try {
    const response = await fetch('/api/product-shelf-banners');
    if (response.ok) {
      const data = await response.json();
      return data.banners || [];
    }
  } catch (error) {
    console.error('Failed to fetch product shelf banners:', error);
  }
  return [];
}

export default function ProductSection() {
  const { products } = useProductContext();
  const [banners, setBanners] = useState<ProductShelfBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductShelfBanners().then(data => {
      if (data.length > 0) {
        setBanners(data);
      } else {
        // Fallback to old system if no banners exist
        const acrylic = products.filter(p => p.categoryId === 'acrylic');

        // 아크릴 상품이 충분하지 않으면 전체 상품 사용
        const productPool = acrylic.length >= 6 ? acrylic : products.slice(0, 6);

        const take = (arr: Product[], start = 0, count = 2): Product[] => {
          return arr.slice(start, start + count);
        };

        const fallbackBanners: ProductShelfBanner[] = [
          {
            id: 's1',
            title: '아크릴 키링 | 다양한 스타일과 색상으로 제작 가능',
            description: '내 마음대로 커스텀! 고품질 아크릴 키링',
            imageUrl: 'https://placehold.co/400x260/FFB6C1/333?text=아크릴+키링',
            products: take(productPool, 0, 2),
          },
          {
            id: 's2',
            title: '아크릴 스탠드 | 캐릭터와 굿즈를 멋지게 세워보세요',
            description: '완벽한 각도로 디스플레이! 자립형 아크릴 스탠드',
            imageUrl: 'https://placehold.co/400x260/87CEEB/333?text=아크릴+스탠드',
            products: take(productPool, 2, 2),
          },
          {
            id: 's3',
            title: '아크릴 굿즈 | 투명하고 견고한 프리미엄 제품',
            description: '내구성 뛰어난 아크릴로 만드는 나만의 굿즈',
            imageUrl: 'https://placehold.co/400x260/98FB98/333?text=아크릴+굿즈',
            products: take(productPool, 4, 2),
          },
        ];
        setBanners(fallbackBanners);
      }
      setLoading(false);
    });
  }, [products]);

  if (loading) {
    return (
      <section className="py-10 md:py-14">
        <h2 className="mb-4 text-[15px] font-semibold text-slate-700">
          단체 굿즈 합리적인 가격으로 예쁘게 만들어 드릴게요.
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="min-h-[240px] md:min-h-[260px] rounded-2xl bg-neutral-200/80" />
              <div className="mt-4 h-4 bg-neutral-200/80 rounded" />
              <div className="mt-2 h-3 bg-neutral-200/80 rounded w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return <ProductShelfCarousel banners={banners} />;
}
