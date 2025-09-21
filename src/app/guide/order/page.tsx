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

const orderGuideSteps = [
  {
    step: 1,
    title: '상품 선택',
    description: '원하는 카테고리에서 마음에 드는 상품을 선택하세요.'
  },
  {
    step: 2,
    title: '옵션 선택',
    description: '사이즈, 수량, 인쇄 옵션 등을 선택하세요.'
  },
  {
    step: 3,
    title: '디자인 업로드',
    description: '인쇄할 디자인 파일을 업로드하거나 온라인 에디터를 이용하세요.'
  },
  {
    step: 4,
    title: '주문 완료',
    description: '결제를 완료하시면 제작이 시작됩니다.'
  }
];

const orderGuideFaq = [
  {
    question: '배송 기간은 얼마나 걸리나요?',
    answer: '상품에 따라 다르지만 일반적으로 3-7영업일이 소요됩니다. 대량 주문이나 특수 인쇄의 경우 더 오래 걸릴 수 있습니다.'
  },
  {
    question: '디자인 파일 요구사항이 있나요?',
    answer: '고해상도 이미지(300dpi 이상)를 권장합니다. AI, EPS, PDF, PNG, JPG 형식을 지원하며, 파일 업로드가 어려우시면 이메일로 전송도 가능합니다.'
  },
  {
    question: '주문 후 디자인 수정이 가능한가요?',
    answer: '제작 시작 전에만 수정이 가능합니다. 제작이 시작된 후에는 수정이 어려우니 주문 전에 충분히 검토해주세요.'
  },
  {
    question: '샘플 제작이 가능한가요?',
    answer: '유료 샘플 서비스를 제공합니다. 샘플 비용은 본 주문 시 전액 차감되며, 대량 주문 전에 품질을 확인하고 싶으신 분들에게 추천합니다.'
  }
];

export default function OrderGuidePage() {
  return (
    <CategoryPageTemplate
      mapping={mapping!}
      products={[]}
      faq={orderGuideFaq}
      processSteps={orderGuideSteps}
    />
  );
}
