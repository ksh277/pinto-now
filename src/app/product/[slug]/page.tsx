'use client';

import { useParams, redirect } from 'next/navigation';
import { getProductIdBySlug } from '@/lib/pricing-data';
import { useEffect } from 'react';

export default function SlugBasedProductPage() {
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : '';

  useEffect(() => {
    if (slug) {
      const productId = getProductIdBySlug(slug);
      if (productId) {
        // Redirect to the actual product page with ID
        redirect(`/products/${productId}`);
      } else {
        // If slug not found, redirect to 404 or products list
        redirect('/akril-goods');
      }
    }
  }, [slug]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">상품 페이지로 이동 중...</p>
      </div>
    </div>
  );
}