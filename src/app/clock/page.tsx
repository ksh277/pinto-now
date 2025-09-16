import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'clock';
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

const clockProducts: any[] = [];

// 시계 카테고리 전용 FAQ
const clockFaq = [
  {
    question: '시계 무브먼트는 어떤 것을 사용하나요?',
    answer: '일본산 정밀 무브먼트를 사용하여 정확한 시간을 표시합니다. 건전지는 AA 1개를 사용하며 약 1년간 사용 가능합니다.'
  },
  {
    question: '벽걸이 시계 설치는 어떻게 하나요?',
    answer: '벽걸이용 고리와 나사가 함께 제공됩니다. 벽면에 나사를 고정한 후 시계를 걸면 됩니다. 설치 가이드도 함께 제공됩니다.'
  },
  {
    question: '사진을 넣은 시계 제작이 가능한가요?',
    answer: '네, 개인 사진이나 로고를 넣어 제작 가능합니다. 고해상도 이미지(300dpi 이상)를 제출해주시면 선명한 인쇄가 가능합니다.'
  },
  {
    question: '시계 AS는 어떻게 받을 수 있나요?',
    answer: '제품 하자 시 1년 무상 AS를 제공합니다. 무브먼트 고장 시 교체해드리며, 정상 사용 중 발생한 문제는 무료로 수리해드립니다.'
  }
];

export default function ClockPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={clockProducts}
      faq={clockFaq}
    />
  );
}