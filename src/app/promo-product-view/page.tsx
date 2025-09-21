import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';
import { query } from '@/lib/mysql';

const categorySlug = 'promo-product-view';
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

async function getPromoProductViewProducts() {
  try {
    const products = await query(`
      SELECT id, name, thumbnail_url as image, price
      FROM products
      WHERE category_id = 23 AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `) as any[];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['단체판촉상품'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching promo product view products:', error);
    return [];
  }
}

const promoFaq = [
  {
    question: '최소 주문 수량은 얼마인가요?',
    answer: '판촉용 상품은 일반적으로 100개부터 주문 가능하며, 상품에 따라 최소 주문 수량이 다를 수 있습니다. 대량 주문 시 더 큰 할인 혜택을 받으실 수 있습니다.'
  },
  {
    question: '로고나 회사명을 넣을 수 있나요?',
    answer: '네, 모든 판촉용 상품에 로고, 회사명, 연락처 등을 인쇄할 수 있습니다. 다양한 인쇄 방식으로 최적의 결과물을 제작해드립니다.'
  },
  {
    question: '납기는 얼마나 걸리나요?',
    answer: '디자인 확정 후 5-7 영업일이 소요됩니다. 급한 일정이 있으시면 특급 제작 서비스도 이용 가능합니다. (추가 비용 발생)'
  },
  {
    question: '세금계산서 발행이 가능한가요?',
    answer: '네, 법인 및 개인사업자 대상으로 세금계산서 발행이 가능합니다. 주문 시 사업자등록증을 제출해주시면 됩니다.'
  },
  {
    question: '전국 배송이 가능한가요?',
    answer: '전국 어디든 배송 가능하며, 대량 주문 시 무료배송입니다. 도서산간 지역은 추가 배송비가 발생할 수 있습니다.'
  }
];

export default async function PromoProductViewPage() {
  const products = await getPromoProductViewProducts();

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