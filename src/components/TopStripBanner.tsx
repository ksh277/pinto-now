'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pinto.topBanner.dismissedAt';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isHiddenForAWeek() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? Date.now() - Number(v) < WEEK_MS : false;
  } catch {
    return false;
  }
}

export default function TopBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisible(!isHiddenForAWeek());
  }, []);

  const close = () => {
    try {
      if (dontShow) localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div className="sticky top-0 z-[60] w-full">
      <div
        role="region"
        aria-label="공지 배너"
        className="w-full bg-gradient-to-r from-[#19496e] via-[#16788b] to-[#17a39a] text-white"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-1.5 text-[11px] sm:text-sm">
          {/* 가운데 정렬된 플친 텍스트 */}
          <div className="flex-1 flex justify-center">
            <p className="truncate text-center">
              나만의 굿즈 메이킹 ‘핀토’ OPEN EVENT │ 카카오톡 플친 500Point
            </p>
          </div>
          {/* 우측 컨트롤: 일주일간 보지 않기, 닫기 */}
          <div className="flex items-center gap-3 ml-auto">
            <label className="hidden cursor-pointer items-center gap-2 sm:inline-flex">
              <input
                type="checkbox"
                className="h-3 w-3 accent-white"
                aria-label="일주일 간 보지 않기"
                onChange={(e) => setDontShow(e.target.checked)}
              />
              <span>일주일 간 보지 않기</span>
            </label>
            <button
              type="button"
              aria-label="배너 닫기"
              onClick={close}
              className="rounded px-1 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
