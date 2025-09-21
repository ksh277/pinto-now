import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';
import { query } from '@/lib/mysql';

const categorySlug = 'custom-product-view';
const mapping = getCategoryMapping(categorySlug);

if (!mapping) {
  throw new Error(`Category mapping not found for: ${categorySlug}`);
}

const safeMapping = mapping as import('@/lib/category-mappings').CategoryMapping;

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

async function getCustomProductViewProducts() {
  try {
    const products = await query(`
      SELECT id, name, thumbnail_url as image, price
      FROM products
      WHERE category_id = 22 AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `) as any[];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['커스텀상품'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching custom product view products:', error);
    return [];
  }
}

const customFaq = [
  {
    question: '어떤 이미지든 제품으로 만들 수 있나요?',
    answer: '네, 고해상도 이미지라면 어떤 이미지든 제품으로 제작 가능합니다. 다만 저작권이 있는 이미지는 사용에 제한이 있을 수 있습니다.'
  },
  {
    question: '디자인 파일이 없어도 제작할 수 있나요?',
    answer: '물론입니다! 아이디어나 텍스트만 주시면 전문 디자이너가 맞춤 디자인을 제작해드립니다. 추가 디자인 비용이 발생할 수 있습니다.'
  },
  {
    question: '샘플을 먼저 확인할 수 있나요?',
    answer: '유료 샘플 제작 서비스를 제공합니다. 샘플 비용은 본 주문 시 전액 차감되므로 부담 없이 이용하실 수 있습니다.'
  },
  {
    question: '최소 주문 수량이 있나요?',
    answer: '대부분의 맞춤 제품은 1개부터 주문 가능합니다. 단, 일부 제품은 최소 주문 수량이 있을 수 있으니 상품별로 확인해주세요.'
  }
];

export default async function CustomProductViewPage() {
  const products = await getCustomProductViewProducts();

  return (
    <CategoryPageTemplate
      mapping={safeMapping}
      products={products}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}