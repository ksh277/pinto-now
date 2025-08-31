'use client';

import { useEffect, useState } from 'react';
import { isHidden, setSessionClosed, type StripBannerData } from '@/lib/banner';

export default function TopStripBanner() {
  const [banner, setBanner] = useState<StripBannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/strip-banners/active', { cache: 'no-store' });
        const data = await res.json();
        if (data && !isHidden(data.id)) {
          setBanner(data);
        }
      } catch {
        // ignore
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    }
    load();
  }, []);

  if (loading) return <div className="h-10 w-full animate-pulse bg-gray-200" />;
  if (!banner) return null;

  const onClose = () => {
    setSessionClosed(banner.id);
    setBanner(null);
  };

  return (
    <div
      role="banner"
      className="w-full text-center text-sm text-white"
      style={{ background: banner.bgType === 'color' ? banner.bgValue : undefined }}
    >
      <div className="flex items-center justify-center gap-4 p-2">
        <a href={banner.href || '#'} className="flex-1">
          {banner.message}
        </a>
        {banner.canClose && (
          <button aria-label="close" onClick={onClose} className="px-2">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
