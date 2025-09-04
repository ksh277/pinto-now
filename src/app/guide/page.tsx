import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'guide';
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
    title: '제품 선택 & 디자인 준비',
    description: '원하는 굿즈를 선택하고 디자인 파일을 준비합니다. AI, PSD, PNG, JPG 등 다양한 형식을 지원합니다.'
  },
  {
    step: 2,
    title: '주문서 작성 & 결제',
    description: '수량, 옵션, 배송지 등을 입력하고 결제를 완료합니다. 결제 후 디자인 검토가 시작됩니다.'
  },
  {
    step: 3,
    title: '디자인 검토 & 수정',
    description: '전문 디자이너가 인쇄 적합성을 검토하고 필요시 수정 작업을 진행합니다.'
  },
  {
    step: 4,
    title: '제작 & 품질 검수',
    description: '본격적인 제작에 들어가며 품질 관리팀이 완성품을 철저히 검수합니다.'
  },
  {
    step: 5,
    title: '포장 & 배송',
    description: '안전한 포장 후 지정된 주소로 배송합니다. 배송 추적 정보를 실시간으로 확인할 수 있습니다.'
  }
];

const guideFaq = [
  {
    question: '디자인 파일은 어떤 형식으로 제출해야 하나요?',
    answer: 'AI, PSD, PNG, JPG, PDF 등 다양한 형식을 지원합니다. 해상도는 300dpi 이상을 권장하며, 벡터 형식(AI, EPS)이 가장 좋습니다.'
  },
  {
    question: '디자인이 없으면 제작할 수 없나요?',
    answer: '디자인이 없으시더라도 괜찮습니다. 전문 디자이너가 고객님의 아이디어를 바탕으로 디자인을 제작해드립니다. 별도의 디자인 비용이 발생할 수 있습니다.'
  },
  {
    question: '주문 후 디자인 수정이 가능한가요?',
    answer: '제작 시작 전까지는 디자인 수정이 가능합니다. 단, 제작이 시작된 후에는 수정이 어려우니 신중하게 검토해주세요.'
  },
  {
    question: '급하게 필요한데 제작 기간을 단축할 수 있나요?',
    answer: '특급 제작 서비스를 이용하시면 일반 제작 기간의 50% 단축이 가능합니다. 추가 비용이 발생하며, 상품에 따라 제한이 있을 수 있습니다.'
  },
  {
    question: '제작 과정을 실시간으로 확인할 수 있나요?',
    answer: '마이페이지에서 주문 상태를 실시간으로 확인할 수 있습니다. 각 단계별로 알림 메시지도 발송됩니다.'
  },
  {
    question: '배송은 어떻게 이루어지나요?',
    answer: '택배사를 통해 배송되며, 주문 시 선택하신 배송 옵션에 따라 일반배송 또는 당일배송(지역 제한)이 가능합니다.'
  }
];

export default function GuidePage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      faq={guideFaq}
      processSteps={processSteps}
    />
  );
}