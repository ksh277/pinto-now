import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';
import { Metadata } from 'next';

const categorySlug = 'signage';
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

// 광고물/사인 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getSignageProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [16, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['사인'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching signage products:', error);
    return [];
  }
}

// 광고물/사인 카테고리 전용 FAQ
const signageFaq = [
  {
    question: '실외용과 실내용 사인물의 차이는 무엇인가요?',
    answer: '실외용은 UV차단 코팅과 방수 처리된 소재를 사용합니다. 실내용보다 내구성이 뛰어나지만 비용이 더 높습니다. 설치 환경에 맞는 제품을 선택해주세요.'
  },
  {
    question: '사인물 설치 서비스도 제공하나요?',
    answer: '대형 사인물의 경우 설치 서비스를 제공합니다. 지역에 따라 추가 비용이 발생할 수 있으며, 사전에 현장 확인 후 설치 일정을 조율합니다.'
  },
  {
    question: '디자인 파일이 없는데 제작해주나요?',
    answer: '네, 전문 디자이너가 디자인을 제작해드립니다. 업종과 용도에 맞는 디자인을 제안하며, 수정 작업도 포함됩니다.'
  },
  {
    question: '긴급 제작이 가능한가요?',
    answer: '당일 또는 익일 제작도 가능합니다. 긴급 제작비(30-50% 추가)가 발생하며, 디자인 확정 시간에 따라 완성 시간이 달라집니다.'
  }
];

export default async function SignagePage() {
  const products = await getSignageProducts();

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