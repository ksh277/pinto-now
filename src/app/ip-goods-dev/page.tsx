import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'ip-goods-dev';
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

const processSteps = [
  {
    step: 1,
    title: 'IP 라이선스 검토',
    description: '보유하신 IP의 상업적 활용 가능성과 라이선스 조건을 검토합니다.'
  },
  {
    step: 2,
    title: '상품 기획 & 디자인',
    description: 'IP 특성에 맞는 최적의 굿즈를 기획하고 전문 디자이너가 디자인합니다.'
  },
  {
    step: 3,
    title: '샘플 제작 & 검수',
    description: '실제 제품과 동일한 샘플을 제작하여 품질과 디자인을 확인합니다.'
  },
  {
    step: 4,
    title: '대량 생산 & 납품',
    description: '검수 완료 후 대량 생산에 들어가 일정에 맞춰 납품합니다.'
  }
];

const ipFaq = [
  {
    question: 'IP 라이선스가 없어도 상담 가능한가요?',
    answer: '네, 가능합니다. IP 등록부터 굿즈 제작까지 전 과정을 도와드릴 수 있습니다. IP 등록 절차와 비용에 대해서도 상세히 안내드립니다.'
  },
  {
    question: '어떤 종류의 IP가 굿즈 제작에 적합한가요?',
    answer: '캐릭터, 로고, 일러스트, 폰트, 브랜드 등 다양한 IP가 굿즈 제작에 활용 가능합니다. IP의 시각적 특성과 타겟 고객을 고려하여 최적의 굿즈를 제안합니다.'
  },
  {
    question: '최소 제작 수량은 얼마인가요?',
    answer: 'IP 굿즈는 일반적으로 100개부터 제작 가능하며, 상품 종류에 따라 다를 수 있습니다. 테스트 판매용 소량 제작도 가능합니다.'
  },
  {
    question: '수익 배분은 어떻게 이루어지나요?',
    answer: 'IP 소유자와 제작사 간 수익 배분은 협의를 통해 결정됩니다. 일반적으로 매출액의 10-30% 범위에서 로열티가 책정됩니다.'
  },
  {
    question: '해외 판매도 가능한가요?',
    answer: '네, 해외 판매 채널 구축과 수출 업무도 지원 가능합니다. 글로벌 IP 라이선스 관련 법적 검토도 함께 진행합니다.'
  }
];

export default function IpGoodsDevPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      faq={ipFaq}
      processSteps={processSteps}
    />
  );
}