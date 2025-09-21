import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';
import { query } from '@/lib/mysql';

const categorySlug = 'pet';
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

async function getPetProducts() {
  try {
    const products = await query(`
      SELECT id, name, thumbnail_url as image, price
      FROM products
      WHERE category_id = 28 AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `) as any[];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['반려동물'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching pet products:', error);
    return [];
  }
}

// 반려동물 카테고리 전용 FAQ
const petFaq = [
  {
    question: '반려동물용 제품은 안전한 소재를 사용하나요?',
    answer: '네, 모든 반려동물용 제품은 펫 전용 안전 소재를 사용합니다. 무독성, 친환경 소재로 제작되며, 반려동물이 핥거나 물어도 안전합니다.'
  },
  {
    question: '인식표에 어떤 정보를 새길 수 있나요?',
    answer: '반려동물 이름, 보호자 연락처, 주소 등을 새길 수 있습니다. 글자수 제한이 있으니 꼭 필요한 정보만 간단히 새기시기를 권장합니다.'
  },
  {
    question: '반려동물 사진으로 제작할 때 어떤 사진이 좋나요?',
    answer: '밝고 선명한 사진이 좋습니다. 배경이 단순하고 반려동물이 정면을 바라보는 사진이 가장 좋은 결과를 만들어냅니다. 고해상도 사진을 제출해주세요.'
  },
  {
    question: '반려동물 크기에 맞는 제품 선택은 어떻게 하나요?',
    answer: '견종별, 크기별 가이드를 제공합니다. 목둘레, 몸무게 등을 측정하여 알려주시면 최적의 사이즈를 추천해드립니다.'
  }
];

export default async function PetPage() {
  const products = await getPetProducts();

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