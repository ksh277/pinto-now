import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';
import { query } from '@/lib/mysql';

const categorySlug = 'packaging';
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

async function getPackagingProducts() {
  try {
    const products = await query(`
      SELECT id, name, thumbnail_url as image, price
      FROM products
      WHERE category_id = 34 AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `) as any[];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['포장'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching packaging products:', error);
    return [];
  }
}

export default async function PackagingPage() {
  const products = await getPackagingProducts();

  return (
    <CategoryPageTemplate
      mapping={mapping!}
      products={products}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}