import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';
import { Metadata } from 'next';

const categorySlug = 'packing-supplies';
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

// 포장 부자재 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getPackingSuppliesProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [20, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['포장용품'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching packing supplies products:', error);
    return [];
  }
}

// 포장 부자재 카테고리 전용 FAQ
const packingSuppliesFaq = [
  {
    question: '포장 부자재만 단독으로 주문할 수 있나요?',
    answer: '네, 포장 부자재만 별도로 주문 가능합니다. 다양한 사이즈와 수량으로 제공하며, 대량 주문 시 할인 혜택도 있습니다.'
  },
  {
    question: '맞춤 포장테이프에는 어떤 디자인을 넣을 수 있나요?',
    answer: '회사 로고, 브랜드명, 연락처, 특별 메시지 등을 넣을 수 있습니다. 단색 또는 2색 인쇄가 가능하며, 최소 주문 수량이 있습니다.'
  },
  {
    question: '친환경 포장재도 있나요?',
    answer: '네, 재활용 가능한 크라프트지, 생분해 포장재, FSC 인증 종이박스 등 다양한 친환경 옵션을 제공합니다.'
  },
  {
    question: '대량 주문 시 할인 혜택은 어떻게 되나요?',
    answer: '수량별로 5-20%까지 할인 혜택을 제공합니다. 정확한 할인율과 최소 주문 수량은 상품별로 다르니 상담받아보세요.'
  }
];

export default async function PackingSuppliesPage() {
  const products = await getPackingSuppliesProducts();

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