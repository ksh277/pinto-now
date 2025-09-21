import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';
import { Metadata } from 'next';

const categorySlug = 'fan-goods';
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

// 팬굿즈 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getFanGoodsProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [13, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['팬굿즈'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching fan goods products:', error);
    return [];
  }
}

const fanGoodsFaq = [
  {
    question: '저작권 문제는 괜찮나요?',
    answer: '개인 팬아트나 자작 이미지는 문제없습니다. 다만 공식 이미지나 저작권이 있는 콘텐츠는 권리자의 허가가 필요할 수 있습니다. 불확실한 경우 상담을 받아보세요.'
  },
  {
    question: '소량으로도 제작 가능한가요?',
    answer: '네! 대부분의 팬굿즈는 1개부터 제작 가능합니다. 개인 소장용이나 소규모 팬모임용으로 부담 없이 주문하실 수 있습니다.'
  },
  {
    question: '콘서트나 팬미팅에 맞춰 급하게 제작할 수 있나요?',
    answer: '특급 제작 서비스를 통해 일반 제작 기간보다 빠르게 제작 가능합니다. 이벤트 일정에 맞춰 계획적으로 주문해주시면 더욱 좋습니다.'
  },
  {
    question: '단체 주문 할인이 있나요?',
    answer: '팬클럽이나 팬모임에서 단체 주문 시 수량별 할인 혜택을 제공합니다. 50개 이상 주문 시 최대 25% 할인 가능합니다.'
  },
  {
    question: '이미지 해상도가 낮은데 제작 가능한가요?',
    answer: 'AI 이미지 업스케일링 기술을 활용하여 저해상도 이미지도 고품질로 제작 가능합니다. 다만 원본 품질에 따라 결과물에 차이가 있을 수 있습니다.'
  },
  {
    question: '홀로그램이나 특수 효과 추가가 가능한가요?',
    answer: '홀로그램 스티커, 글리터 효과, 야광 인쇄 등 다양한 특수 효과를 지원합니다. 제품별로 적용 가능한 효과가 다르니 상담받아보세요.'
  }
];

export default async function FanGoodsPage() {
  const products = await getFanGoodsProducts();

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