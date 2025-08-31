"use client";
import { useProductContext } from '@/contexts/product-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';

export default function ProductSection() {
  const { products } = useProductContext();
  const acrylic = products.filter(p => p.categoryId === 'acrylic');
  const wood = products.filter(p => p.categoryId === 'wood');
  const pool: Product[] = products.length ? products : [];
  const take = (arr: Product[], start = 0, count = 3): Product[] =>
    (arr.length ? arr : pool).slice(start, start + count);
  const shelves = [
    {
      id: 's1',
      headline: '티셔츠 | 다양한 색상과 소재가 준비되어 있습니다.',
      sub: '디자인이 고민이면 핀토 상담가에게 문의 주세요',
      moreHref: '/category/apparel',
      picks: take(acrylic, 0, 3),
    },
    {
      id: 's2',
      headline: '키링 | 스포츠, 축제, 행사, 굿즈에 많이 사용되요.',
      sub: '칼선/재단 걱정하지 않아도 돼요. 자동편집!',
      moreHref: '/category/acrylic',
      picks: take(acrylic, 3, 3),
    },
    {
      id: 's3',
      headline: '우산 | 소량부터 대량까지 다양하게 준비되어 있습니다.',
      sub: '핸드폰으로도 뚝딱 만들 수 있는 나만의 굿즈',
      moreHref: '/category/wood',
      picks: take(wood, 0, 3),
    },
  ];
  const fmtPrice = (n?: number) =>
    typeof n === 'number' ? `${n.toLocaleString()}원` : '가격문의';
  return (
    <section className="py-10 md:py-14">
      <h2 className="mb-4 text-[15px] font-semibold text-slate-700">
        단체 굿즈 합리적인 가격으로 예쁘게 만들어 드릴게요.
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {shelves.map(shelf => (
          <div key={shelf.id}>
            {/* 이미지 박스 */}
            <div className="min-h-[240px] md:min-h-[260px] rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/70 pt-12 md:pt-14 pb-7 px-6 flex items-center justify-center">
              {/* 여기에 대표 이미지를 넣으려면 아래처럼 사용하세요. 현재는 예시로 비워둡니다. */}
              {/* <Image src={...} alt={...} ... /> */}
            </div>
            {/* 설명글 */}
            <h3 className="mt-4 text-[15px] font-semibold leading-6 text-neutral-900 dark:text-neutral-100 break-keep">
              {shelf.headline}
            </h3>
            <p className="mt-2 text-[12px] leading-6 text-neutral-600 dark:text-neutral-300 break-keep">
              {shelf.sub}
            </p>
            {/* 상품 리스트 */}
            <div className="mt-4 space-y-4">
              {shelf.picks.map((p: Product) => (
                <div key={p.id} className="flex items-center gap-3">
                  <Link href={`/products/${p.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-200 block">
                    <Image
                      src={p.imageUrl || 'https://placehold.co/300x300.png'}
                      alt={p.nameKo || 'product'}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-slate-500">
                      {p.nameKo || '상품명'}
                    </p>
                    <div className="mt-1 text-[13px] font-semibold text-teal-600">
                      {fmtPrice(p.priceKrw)} <span className="text-teal-600/70">부터</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>♡ {p.stats?.likeCount ?? 0}</span>
                      <span>리뷰 {p.stats?.reviewCount ?? 0}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-1">
                <Button asChild variant="outline" className="h-8 w-full rounded-full border-slate-300 text-xs text-slate-600">
                  <Link href={shelf.moreHref || '#'}>more</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
