import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'umbrella';
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

const umbrellaProducts: any[] = [];

// 우산 카테고리 전용 FAQ
const umbrellaFaq = [
  {
    question: '우산 인쇄는 어떤 부분에 가능한가요?',
    answer: '우산 면(캐노피) 전체 또는 일부분에 인쇄가 가능합니다. 실크스크린이나 승화전사 방식을 사용하며, 방수 처리된 특수 잉크를 사용합니다.'
  },
  {
    question: '방풍 기능은 어느 정도까지 견딜 수 있나요?',
    answer: '일반 우산은 초속 10-15m, 방풍 우산은 초속 20-25m의 바람까지 견딜 수 있습니다. 방풍 우산은 특수 구조로 뒤집어져도 원래 상태로 복원됩니다.'
  },
  {
    question: '우산 손잡이 맞춤 제작이 가능한가요?',
    answer: '플라스틱, 우드, 고무 등 다양한 소재의 손잡이 제작이 가능합니다. 로고 각인이나 특수 모양 제작도 가능하니 상담받아보세요.'
  },
  {
    question: '우산 AS는 어떻게 받을 수 있나요?',
    answer: '제조 결함 시 6개월 무상 교체를 제공합니다. 뼈대 부러짐이나 개폐 불량 등은 수리 서비스도 제공합니다.'
  }
];

export default function UmbrellaPage() {
  return (
    <CategoryPageTemplate
      mapping={mapping!}
      products={umbrellaProducts}
      faq={umbrellaFaq}
    />
  );
}