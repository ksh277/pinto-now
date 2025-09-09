'use client';

import { useLanguage } from '@/contexts/language-context';
import { Card } from '@/components/ui/card';

export function HomeContentClient() {
  const { t } = useLanguage();

  return (
    <>
      {/* INFO CARDS — 작은 캡션 + 회색 박스 (글자 더 아래 / 박스 더 큼) */}
      <section className="pt-12 md:pt-14">
        <p className="mb-4 text-[13px] leading-5 text-slate-500 px-4">
          {t('home.main_description')}
        </p>
      </section>

      {/* 주간 랭킹 헤더 */}
      <section className="pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-slate-700">
            {t('home.weekly_ranking_title')}
          </h2>
        </div>
      </section>

      {/* 하단 3 CTA 카드 */}
      <section>
        <h3 className="mb-4 text-[13px] font-medium text-slate-600">
          {t('home.benefits_title')}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <Card className="rounded-2xl border-none bg-neutral-200/80 p-0 shadow-none dark:bg-neutral-800/70">
            <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-8 text-center md:min-h-[180px]">
              <h4 className="text-base font-bold">{t('home.creator_market')}</h4>
              <p className="mt-1 text-xs text-slate-500">{t('home.creator_market_desc')}</p>
            </div>
          </Card>
          <Card className="rounded-2xl border-none bg-neutral-200/80 p-0 shadow-none dark:bg-neutral-800/70">
            <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-8 text-center md:min-h-[180px]">
              <h4 className="text-base font-bold">{t('home.b2b_title')}</h4>
              <p className="mt-1 text-xs text-slate-500">{t('home.b2b_desc')}</p>
            </div>
          </Card>
          <Card className="rounded-2xl border-none bg-neutral-200/80 p-0 shadow-none dark:bg-neutral-800/70">
            <div className="flex min-h-[160px] flex-col items-center justify-center px-6 py-8 text-center md:min-h-[180px]">
              <h4 className="text-base font-bold">{t('home.personal_title')}</h4>
              <p className="mt-1 text-xs text-slate-500">{t('home.personal_desc')}</p>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mt-2 mb-12">
          <div className="text-[13px] leading-5 text-slate-500">
            {t('home.creator_benefit').split('\\n').map((line, index) => (
              <div key={index}>
                {line}
                {index === 0 && <br />}
              </div>
            ))}
          </div>
          <div className="text-[13px] leading-5 text-slate-500">
            {t('home.b2b_benefit')}
          </div>
          <div className="text-[13px] leading-5 text-slate-500">
            {t('home.personal_benefit')}
          </div>
        </div>
      </section>
    </>
  );
}