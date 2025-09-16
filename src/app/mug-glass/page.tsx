import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'mug-glass';
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

const mugGlassProducts: any[] = [];

// 머그컵/유리컵 카테고리 전용 FAQ
const mugGlassFaq = [
  {
    question: '머그컵 인쇄는 어떤 방식으로 하나요?',
    answer: '열전사, 승화전사, 실크스크린 인쇄 방식을 사용합니다. 도자기는 승화전사, 스테인리스는 레이저각인이나 실크스크린을 권장합니다.'
  },
  {
    question: '식기세척기 사용이 가능한가요?',
    answer: '도자기와 유리 제품은 식기세척기 사용이 가능합니다. 스테인리스 제품은 인쇄 방식에 따라 다르니 개별 문의해주세요.'
  },
  {
    question: '선물용 포장이 가능한가요?',
    answer: '네, 개별 선물 박스 포장이 가능합니다. 박스당 1,000원의 추가 비용이 있으며, 리본 포장도 함께 제공됩니다.'
  },
  {
    question: '대량 주문 시 할인 혜택이 있나요?',
    answer: '50개 이상 10% 할인, 100개 이상 15% 할인 혜택을 제공합니다. 기업 답례품이나 기념품용 대량 주문을 환영합니다.'
  }
];

export default function MugGlassPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={mugGlassProducts}
      faq={mugGlassFaq}
    />
  );
}