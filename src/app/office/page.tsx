import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';
import { Metadata } from 'next';

const categorySlug = 'office';
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

// 오피스 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getOfficeProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [21, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['오피스'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching office products:', error);
    return [];
  }
}

const officeFaq = [
  {
    question: '사무용품에 회사 로고를 넣을 수 있나요?',
    answer: '네, 모든 문구/오피스 제품에 회사 로고, 브랜딩을 적용할 수 있습니다. 다양한 인쇄 방식으로 고품질 결과물을 제작해드립니다.'
  },
  {
    question: '대량 주문 시 할인 혜택이 있나요?',
    answer: '100개 이상 주문 시 수량별 할인을 적용해드립니다. 500개 이상 대량 주문 시 특별 할인가로 제작 가능합니다.'
  },
  {
    question: '품질은 어떤가요?',
    answer: '업무용으로 사용하기에 충분한 고품질 소재만을 사용합니다. 일반 문구점 제품과 동등하거나 더 우수한 품질을 보장합니다.'
  },
  {
    question: '제작 기간은 얼마나 걸리나요?',
    answer: '디자인 확정 후 5-7 영업일이 소요됩니다. 급한 일정이 있으시면 특급 제작 서비스도 이용 가능합니다.'
  }
];

export default async function OfficePage() {
  const products = await getOfficeProducts();

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