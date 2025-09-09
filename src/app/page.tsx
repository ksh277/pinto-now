import Link from 'next/link';
import Image from 'next/image';
import TopStripBanner from '@/components/TopStripBanner';
import TopBanner from '@/components/TopBanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CategoryShortcuts } from '@/components/category-shortcuts';
import ProductSectionClient from '@/components/main/ProductSectionClient';
import type { Product } from '@/lib/types';
import { StripBannerProvider } from '@/contexts/StripBannerContext';
import MainBannerSection from '@/components/main/MainBannerSection';
import InfoCardsCarousel from '@/components/InfoCardsCarousel';
import WeeklyRankingCards from '@/components/WeeklyRankingCards';

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
import { ChevronRight, ChevronLeft } from 'lucide-react';

function getInfoCards() {
  // 임시로 하드코딩된 데이터 사용 (DB 연결 후 API 호출로 변경 예정)
  return [
    { id: '1', title: '나랑 가까운 오프라인샵은 어디에 있을까요?', description: '핸드폰으로 뚝딱뚝딱 빠르고 간편하게 나만의 굿즈를 만들 수 있습니다.' },
    { id: '2', title: '내 반려동물을 위한 굿즈출시', description: '일상생활용품, 반려장례용품, 추억 다양한 제품들이 준비되어 있습니다.' },
    { id: '3', title: '커스텀 아이디어로 나만의 굿즈 판매하기', description: '핀토에서 준비한 굿즈 제품들로 나만의 디자인을 입혀 판매할 수 있습니다.' },
    { id: '4', title: '웹툰/연예인 응원봉,포토카드,아크릴', description: '단체주문,소량부터 대량까지 핀토에게 맡겨 주세요. 직접 생산감리도 가능!' },
    { id: '5', title: '커스터마이징 전문 컨설팅', description: '전문 디자이너와 함께 브랜딩부터 제품까지 완성도 높은 굿즈를 만들어보세요.' },
    { id: '6', title: '친환경 소재로 만드는 굿즈', description: '환경을 생각하는 지속가능한 소재로 제작하는 친환경 굿즈 라인업입니다.' },
    { id: '7', title: '24시간 빠른 배송 서비스', description: '급하게 필요한 굿즈도 24시간 내 제작 완료! 빠른 배송으로 만족도 100%입니다.' },
  ];
}

export default async function HomePage() {

  const infoCards = getInfoCards();

  let weekly: WeeklyMarketItem[] = [];
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
      <div className="flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen">
        {/* HERO - 전체 화면 꽉 참, 여백 없음 */}
        <section className="">
          <TopBanner />
        </section>
        
        {/* 나머지 콘텐츠에만 패딩 적용 */}
        <div className="px-8 md:px-16">

        {/* SHORTCUTS는 TopBanner 컴포넌트 내에서 처리됨 */}

        {/* INFO CARDS — 작은 캡션 + 회색 박스 (글자 더 아래 / 박스 더 큼) */}
        <section className="pt-12 md:pt-14">
          <p className="mb-4 text-[13px] leading-5 text-slate-500 px-4">
            온, 오프라인 어디에서나 쉽고 빠르게 만들 수 있어요!
          </p>
          <InfoCardsCarousel cards={infoCards} />
        </section>

        {/* PRODUCT SHELF — 3열(상단 회색 배너 + 하단 미니 리스트) infoCards section 바로 아래로 이동 */}
        <ProductSectionClient />

        {/* MAIN BANNER SECTION - 주간 랭킹 위에 슬라이드 배너 */}
        <section className="pt-6 pb-4">
          <MainBannerSection />
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

          <WeeklyRankingCards 
            sellerType="INDIVIDUAL" 
            limit={4} 
            showRankNumbers={true}
          />
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
      </div>
    </StripBannerProvider>
  );
}
