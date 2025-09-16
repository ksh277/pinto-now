import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'led-neon';
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

const ledNeonProducts: any[] = [];

// LED 네온 카테고리 전용 FAQ
const ledNeonFaq = [
  {
    question: 'LED 네온의 수명은 얼마나 되나요?',
    answer: '일반적으로 50,000시간 이상 사용 가능합니다. 하루 8시간 사용 시 약 17년 정도 사용할 수 있으며, 기존 네온사인 대비 10배 이상 긴 수명을 자랑합니다.'
  },
  {
    question: 'LED 네온 전력 소모량은 어느 정도인가요?',
    answer: '기존 네온사인 대비 80% 이상 전력을 절약할 수 있습니다. 1미터 기준 약 10-15W 정도 소모되어 매우 경제적입니다.'
  },
  {
    question: '실외 설치 시 방수가 되나요?',
    answer: '실외용 LED 네온은 IP65 등급의 방수 처리가 되어 있어 비나 눈에도 안전합니다. 전용 아답터와 방수 커넥터를 사용합니다.'
  },
  {
    question: '색상 변경이나 깜빡임 효과가 가능한가요?',
    answer: 'RGB 타입은 다양한 색상 변경과 깜빡임 효과가 가능합니다. 전용 컨트롤러를 사용하여 패턴과 속도를 조절할 수 있습니다.'
  }
];

export default function LedNeonPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={ledNeonProducts}
      faq={ledNeonFaq}
    />
  );
}