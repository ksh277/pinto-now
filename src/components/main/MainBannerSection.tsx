"use client";

import React, { useEffect, useState } from 'react';
import { fetchBanners, type Banner } from '@/lib/banner';

export default function MainBannerSection() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetchBanners().then(setBanners).catch(() => setBanners([]));
  }, []);

  return (
    <section style={{ display: 'flex', justifyContent: 'center', gap: 40, background: '#fafbfc', padding: '32px 0' }}>
      {banners.slice(0, 12).map((banner) => (
        <div key={banner.id} style={{ textAlign: 'center' }}>

        </div>
      ))}
    </section>
  );
}
