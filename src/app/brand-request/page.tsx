import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'brand-request';
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

const processSteps = [
  {
    step: 1,
    title: '브랜드 분석 & 상담',
    description: '브랜드의 정체성과 목표를 분석하고 최적의 굿즈 전략을 수립합니다.'
  },
  {
    step: 2,
    title: '맞춤 기획 & 제안',
    description: '브랜드 컨셉에 맞는 굿즈를 기획하고 구체적인 제안서를 작성합니다.'
  },
  {
    step: 3,
    title: '디자인 & 샘플 제작',
    description: '브랜드 가이드라인에 따라 디자인하고 실제 샘플을 제작합니다.'
  },
  {
    step: 4,
    title: '생산 관리 & 납품',
    description: '품질 관리와 일정 관리를 통해 완성도 높은 제품을 납품합니다.'
  }
];

const brandFaq = [
  {
    question: '어떤 브랜드든 의뢰 가능한가요?',
    answer: '스타트업부터 대기업까지 규모와 업종에 관계없이 모든 브랜드의 의뢰를 받고 있습니다. 브랜드 특성에 맞는 맞춤 서비스를 제공합니다.'
  },
  {
    question: '브랜드 가이드라인이 없어도 되나요?',
    answer: '브랜드 가이드라인이 없으시더라도 괜찮습니다. 브랜드 정체성 수립부터 가이드라인 제작까지 전체적인 브랜딩 서비스도 제공합니다.'
  },
  {
    question: '최소 프로젝트 규모가 있나요?',
    answer: '프로젝트 규모에 제한은 없습니다. 소규모 이벤트용 굿즈부터 대규모 마케팅 캠페인용 제품까지 모든 규모의 프로젝트를 진행합니다.'
  },
  {
    question: '비용은 어떻게 책정되나요?',
    answer: '프로젝트 규모, 제품 종류, 수량, 일정 등을 종합적으로 고려하여 견적을 산출합니다. 투명하고 합리적인 가격으로 서비스를 제공합니다.'
  },
  {
    question: '납기 관리는 어떻게 하나요?',
    answer: '전담 프로젝트 매니저가 배정되어 전 과정을 체계적으로 관리합니다. 실시간 진행 상황 공유와 일정 관리를 통해 약속된 납기를 준수합니다.'
  }
];

export default function BrandRequestPage() {
  return (
    <CategoryPageTemplate 
      mapping={safeMapping}
      faq={brandFaq}
      processSteps={processSteps}
    />
  );
}