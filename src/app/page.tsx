import Link from 'next/link';
import Image from 'next/image';
import TopStripBanner from '@/components/TopStripBanner';
import TopBanner from '@/components/TopBanner';
import MainBannerSection from '@/components/main/MainBannerSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CategoryShortcuts } from '@/components/category-shortcuts';
import ProductSectionClient from '@/components/main/ProductSectionClient';
import type { Product } from '@/lib/types';
import { StripBannerProvider } from '@/contexts/StripBannerContext';

// Define Rankable type if not imported
type Rankable = {
  id: string;
  nameKo?: string;
  priceKrw?: number;
  imageUrl?: string;
  rank?: number;
  stats?: { likeCount?: number; reviewCount?: number };
};

// Provide a fallback top4 array for demonstration (replace with real data as needed)
const top4: Rankable[] = [
  { id: '1', nameKo: '상품1', priceKrw: 10000, imageUrl: '', rank: 1, stats: { likeCount: 10, reviewCount: 2 } },
  { id: '2', nameKo: '상품2', priceKrw: 20000, imageUrl: '', rank: 2, stats: { likeCount: 20, reviewCount: 4 } },
  { id: '3', nameKo: '상품3', priceKrw: 30000, imageUrl: '', rank: 3, stats: { likeCount: 30, reviewCount: 6 } },
  { id: '4', nameKo: '상품4', priceKrw: 40000, imageUrl: '', rank: 4, stats: { likeCount: 40, reviewCount: 8 } },
];
import { getWeeklyMarket, type WeeklyMarketItem } from '@/lib/market';
import { ChevronRight } from 'lucide-react';

export default async function HomePage() {
  const shortcutCategories = [
    { id: '1', href: '/category/1인샵', label: '1인샵', imgSrc: 'https://placehold.co/100x100.png', hint: 'gift box' },
    { id: '2', href: '/category/선물추천', label: '선물추천', imgSrc: 'https://placehold.co/100x100.png', hint: 'gift box' },
    { id: '3', href: '/category/겨울아이디어', label: '겨울아이디어', imgSrc: 'https://placehold.co/100x100.png', hint: 'snowflake' },
    { id: '4', href: '/category/여행굿즈', label: '여행 굿즈', imgSrc: 'https://placehold.co/100x100.png', hint: 'luggage' },
    { id: '5', href: '/category/문구미니', label: '문구/미니', imgSrc: 'https://placehold.co/100x100.png', hint: 'stationery' },
    { id: '6', href: '/category/반려동물굿즈', label: '반려동물 굿즈', imgSrc: 'https://placehold.co/100x100.png', hint: 'dog paw' },
    { id: '7', href: '/category/의류', label: '의류', imgSrc: 'https://placehold.co/100x100.png', hint: 't-shirt' },
    { id: '8', href: '/category/개성아이디어', label: '개성 아이디어', imgSrc: 'https://placehold.co/100x100.png', hint: 'idea lightbulb' },
  ];

  const infoCards = [
    { id: '1', title: '나랑 가까운 오프라인샵은 어디에 있을까요?', description: '핸드폰으로 뚝딱뚝딱 빠르고 간편하게 나만의 굿즈를 만들 수 있습니다.' },
    { id: '2', title: '내 반려동물을 위한 굿즈출시', description: '일상생활용품, 반려장례용품, 추억 다양한 제품들이 준비되어 있습니다.' },
    { id: '3', title: '커스텀 아이디어로 나만의 굿즈 판매하기', description: '핀토에서 준비한 굿즈 제품들로 나만의 디자인을 입혀 판매할 수 있습니다.' },
    { id: '4', title: '웹툰/연예인 응원봉,포토카드,아크릴', description: '단체주문,소량부터 대량까지 핀토에게 맡겨 주세요. 직접 생산감리도 가능!' },
  ];

  let weekly: WeeklyMarketItem[] = [];
  try {
    weekly = await getWeeklyMarket({ limit: 4 });
  } catch {
    weekly = [];
  }
  const top4Fallback: Rankable[] = top4.map(p => ({
    id: p.id,
    nameKo: p.nameKo,
    priceKrw: p.priceKrw,
    imageUrl: p.imageUrl,
  }));
  const ranking: Rankable[] = weekly.length ? weekly : top4Fallback;
  const showBadge = weekly.length > 0;

  return (
    <StripBannerProvider>
      <div className="flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen px-8 md:px-16">
        {/* HERO */}
        <section className="pt-8">
          <TopBanner />
        </section>
        <MainBannerSection />

        {/* SHORTCUTS */}
        <section className="py-12 md:py-16">
          <CategoryShortcuts categories={shortcutCategories} />
        </section>

        {/* INFO CARDS — 작은 캡션 + 회색 박스 (글자 더 아래 / 박스 더 큼) */}
        <section className="pt-12 md:pt-14">
          <p className="mb-4 text-[13px] leading-5 text-slate-500 px-4">
            온, 오프라인 어디에서나 쉽고 빠르게 만들 수 있어요!
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 px-2 md:px-8">
            {infoCards.map(card => (
              <div
                key={card.id}
                className="min-h-[300px] md:min-h-[340px] rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/70 pt-14 md:pt-60 pb-8 px-6"
              >
                <h3 className="text-[15px] font-semibold leading-6 text-neutral-900 dark:text-neutral-100 break-keep">
                  {card.title}
                </h3>
                <p className="mt-5 text-[12px] leading-6 text-neutral-600 dark:text-neutral-300 break-keep">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCT SHELF — 3열(상단 회색 배너 + 하단 미니 리스트) infoCards section 바로 아래로 이동 */}
        <ProductSectionClient />

        {/* 창작자 CTA (가운데 큰 텍스트/버튼) */}
        <section className="bg-white dark:bg-card">
          <div className="px-4 py-12 text-center md:py-16">
            <h2 className="text-xl font-bold md:text-2xl">
              창작자, 작가 모두가 참여하는 플랫폼 PINTO
            </h2>
            <p className="text-muted-foreground mt-2">
              재고 걱정 없이 디자인만으로 수익을 창출하는 새로운 방법을 알아보세요.
            </p>
            <div className="mt-6">
              <Button variant="outline" className="border-gray-400">
                판매방법 알아보기
              </Button>
            </div>
          </div>
        </section>

        {/* ✅ 주간 랭킹 4카드 — CTA 아래로 이동 */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-700">
              창작자, 작가 참여 마켓 주간 랭킹보기
            </h2>
            <Link href="/market/weekly" className="text-xs text-slate-400 hover:text-slate-600">
              더보기 <ChevronRight className="inline-block h-3 w-3 align-middle" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            {ranking.map((p: Rankable, i: number) => (
              <div key={p.id} className="group">
                <div className="relative h-[180px] w-full overflow-hidden rounded-2xl bg-neutral-200 sm:h-[220px] md:h-[400px]">
                  <Image
                    src={p.imageUrl || 'https://placehold.co/600x600.png'}
                    alt={p.nameKo || 'product'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="px-1 pt-3">
                  <p className="line-clamp-1 text-[12px] text-slate-500">
                    {p.nameKo || '상품명'}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-teal-600">
                      {p.priceKrw?.toLocaleString() ?? '가격문의'}원 <span className="text-teal-600/70">부터</span>
                    </span>
                    {showBadge && (
                      <span className="rounded-md border-2 border-rose-200 px-2 py-[2px] text-[10px] font-semibold text-rose-300">
                        BEST {p.rank ?? i + 1}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 3 CTA 카드 */}
        <h3 className="mb-4 text-[13px] font-medium text-slate-600">
          함께 성장해요. 고객별 혜택 확인하기
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <Card className="rounded-2xl border-none bg-neutral-200/80 p-0 shadow-none dark:bg-neutral-800/70">
            <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-8 text-center md:min-h-[180px]">
              <h4 className="text-base font-bold">창작마켓</h4>
              <p className="mt-1 text-xs text-slate-500">B2C 참여하기</p>
            </div>
          </Card>
          <Card className="rounded-2xl border-none bg-neutral-200/80 p-0 shadow-none dark:bg-neutral-800/70">
            <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-8 text-center md:min-h-[180px]">
              <h4 className="text-base font-bold">관공서, 기업, 대량</h4>
              <p className="mt-1 text-xs text-slate-500">B2B 문의하기</p>
            </div>
          </Card>
          <Card className="rounded-2xl border-none bg-neutral-200/80 p-0 shadow-none dark:bg-neutral-800/70">
            <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-8 text-center md:min-h-[180px]">
              <h4 className="text-base font-bold">개인</h4>
              <p className="mt-1 text-xs text-slate-500">B2C 문의하기</p>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mt-2 mb-12">
          <div className="text-[13px] leading-5 text-slate-500">
            나만의 창작물로 굿즈를 제작, 등록하여 판매를 할 수 있습니다.<br />
            창작물 판매자에게는 소량제작 할인혜택 입점 수수료가 할인이 됩니다.
          </div>
          <div className="text-[13px] leading-5 text-slate-500">
            환경디자인,행사,축제,교육,대량 굿즈 제작이 가능합니다. 핀토는 자체 공장과 다양한 포트폴리오를 보유하고 있어 전문 상담가가 함께 합니다.
          </div>
          <div className="text-[13px] leading-5 text-slate-500">
            구매별 등급이 나눠져 있으며 구매등급에 따라 월 할인 프로모션, 포인트 지급 등이 제공됩니다.
          </div>
        </div>
      </div>
    </StripBannerProvider>
  );
}
