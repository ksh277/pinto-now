import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';
import { query } from '@/lib/mysql';

const categorySlug = 'all';
const mapping = getCategoryMapping(categorySlug);

if (!mapping) {
  throw new Error(`Category mapping not found for: ${categorySlug}`);
}

export const metadata: Metadata = {
  title: `${mapping.categoryKo} | PINTO`,
  description: mapping.description,
  alternates: {
    canonical: `https://pinto.co.kr/${mapping.slug}`
  },
  openGraph: {
    title: `${mapping.categoryKo} | PINTO`,
    description: mapping.description,
    url: `https://pinto.co.kr/${mapping.slug}`,
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: mapping.heroImagePath,
        width: 1200,
        height: 630,
        alt: `${mapping.categoryKo} 메인 이미지`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${mapping.categoryKo} | PINTO`,
    description: mapping.description,
    images: [mapping.heroImagePath]
  }
};

export default async function AllPage() {
  // 모든 활성 상품을 데이터베이스에서 조회
  const products = await query(`
    SELECT
      id,
      name,
      thumbnail_url as image,
      price,
      category_id
    FROM products
    WHERE status = 'ACTIVE'
    ORDER BY created_at DESC
  `) as any[];

  // 상품 데이터를 CategoryPageTemplate 형식에 맞게 변환
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    image: product.image || '/components/img/placeholder-product.jpg',
    tags: ['상품'], // 기본 태그
    price: parseInt(product.price)
  }));

  return (
    <CategoryPageTemplate
      mapping={mapping!}
      products={formattedProducts}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}