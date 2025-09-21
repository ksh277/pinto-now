import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';
import { Metadata } from 'next';

const categorySlug = 'life-size-standee';
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

// 등신대 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getStandeeProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [17, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['등신대'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching standee products:', error);
    return [];
  }
}

// 등신대 카테고리 전용 FAQ
const standeeFaq = [
  {
    question: '골판지와 PVC 등신대의 차이점은 무엇인가요?',
    answer: '골판지는 실내 단기 이벤트에 적합하고 가격이 저렴합니다. PVC는 내구성이 뛰어나 장기간 사용하거나 야외에서도 사용 가능하며 반복 사용할 수 있습니다.'
  },
  {
    question: '등신대 제작 시 필요한 사진 규격은 어떻게 되나요?',
    answer: '전신 사진이 필요하며, 해상도는 최소 300dpi 이상을 권장합니다. 배경이 단순하고 인물이 명확한 사진일수록 더 좋은 결과물을 얻을 수 있습니다.'
  },
  {
    question: '등신대 배송은 어떻게 이루어지나요?',
    answer: '완성품은 접혀서 배송되며, 조립용 받침대가 함께 제공됩니다. 대형 상품이므로 별도의 배송비가 발생하며, 전국 배송 가능합니다.'
  },
  {
    question: '이벤트용 대량 주문 시 할인 혜택이 있나요?',
    answer: '10개 이상 주문 시 10% 할인, 20개 이상 주문 시 15% 할인 혜택을 제공합니다. 기업 이벤트나 행사용 대량 주문을 환영합니다.'
  }
];

export default async function LifeSizeStandeePage() {
  const products = await getStandeeProducts();

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