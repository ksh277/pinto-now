import type { Product, ProductStats } from '@/types/product';

export async function getProductsByCategory(key: string): Promise<Product[]> {
  try {
    // Add timeout for build-time safety
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(`/api/products?category=${encodeURIComponent(key)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // During build time, API routes aren't available, so use fallback
    console.warn('Failed to fetch products during build, using fallback data');
  }
  return [
    { id: '1', nameKo: '샘플 상품', imageUrl: '/images/sample-banner1.svg', priceKrw: 10000 },
    { id: '2', nameKo: '샘플 상품 2', imageUrl: '/images/sample-banner2.svg', priceKrw: 12000 },
  ];
}

export async function getProductStats(ids: string[]): Promise<Record<string, ProductStats>> {
  try {
    // Add timeout for build-time safety
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const res = await fetch(`/api/products/stats?ids=${ids.join(',')}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // During build time, API routes aren't available, so use fallback
    console.warn('Failed to fetch product stats during build, using fallback data');
  }
  const fallback: Record<string, ProductStats> = {};
  ids.forEach(id => {
    fallback[id] = { reviewCount: 0, likeCount: 0 };
  });
  return fallback;
}
