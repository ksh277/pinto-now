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
        const wood = products.filter(p => p.categoryId === 'wood');
        const pool: Product[] = products.length ? products : [];
        const take = (arr: Product[], start = 0, count = 3): Product[] =>
          (arr.length ? arr : pool).slice(start, start + count);

        const fallbackBanners: ProductShelfBanner[] = [
          {
            id: 's1',
            title: '티셔츠 | 다양한 색상과 소재가 준비되어 있습니다.',
            description: '디자인이 고민이면 핀토 상담가에게 문의 주세요',
            imageUrl: 'https://placehold.co/400x260/e2e8f0/64748b.png?text=T-Shirt+Banner',
            products: take(acrylic, 0, 3),
          },
          {
            id: 's2',
            title: '키링 | 스포츠, 축제, 행사, 굿즈에 많이 사용되요.',
            description: '칼선/재단 걱정하지 않아도 돼요. 자동편집!',
            imageUrl: 'https://placehold.co/400x260/e2e8f0/64748b.png?text=Keyring+Banner',
            products: take(acrylic, 3, 3),
          },
          {
            id: 's3',
            title: '우산 | 소량부터 대량까지 다양하게 준비되어 있습니다.',
            description: '핸드폰으로도 뚝딱 만들 수 있는 나만의 굿즈',
            imageUrl: 'https://placehold.co/400x260/e2e8f0/64748b.png?text=Umbrella+Banner',
            products: take(wood, 0, 3),
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
