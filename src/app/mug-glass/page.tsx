import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';
import { query } from '@/lib/mysql';

const categorySlug = 'mug-glass';
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

// 머그컵/유리컵 카테고리 상품 데이터를 데이터베이스에서 직접 가져오는 함수
async function getMugGlassProducts() {
  try {
    const products = await query(`
      SELECT
        id,
        name,
        thumbnail_url as image,
        price
      FROM products
      WHERE category_id = 3 AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `) as any[];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['머그컵', '유리컵'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching mug glass products:', error);
    return []; // 에러 시 빈 배열 반환
  }
}

export default async function MugGlassPage() {
  const mugGlassProducts = await getMugGlassProducts();

  return (
    <CategoryPageTemplate
      mapping={mapping}
      products={mugGlassProducts}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}