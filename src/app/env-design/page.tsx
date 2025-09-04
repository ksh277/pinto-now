import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'env-design';
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

// 환경디자인 카테고리 전용 샘플 제품들
const envDesignProducts = [
  { id: 'wall-graphics-design', name: '벽면 그래픽 디자인', tags: ['벽면', '그래픽', '인테리어'], price: 500000, image: '/images/env-design/wall-graphics.png' },
  { id: 'floor-graphics-design', name: '바닥 그래픽 디자인', tags: ['바닥', '그래픽', '안내'], price: 300000, image: '/images/env-design/floor-graphics.png' },
  { id: 'window-graphics-design', name: '창문 그래픽 디자인', tags: ['창문', '시트', '프라이버시'], price: 200000, image: '/images/env-design/window-graphics.png' },
  { id: 'exhibition-design', name: '전시 공간 디자인', tags: ['전시', '공간', '연출'], price: 1000000, image: '/images/env-design/exhibition-design.png' },
  { id: 'office-space-design', name: '사무공간 디자인', tags: ['사무실', '브랜딩', '환경'], price: 800000, image: '/images/env-design/office-design.png' },
  { id: 'retail-space-design', name: '매장 공간 디자인', tags: ['매장', '리테일', '고객'], price: 1200000, image: '/images/env-design/retail-design.png' }
];

// 환경디자인 카테고리 전용 FAQ
const envDesignFaq = [
  {
    question: '환경디자인 프로젝트는 어떤 과정으로 진행되나요?',
    answer: '현장 조사 → 컨셉 기획 → 디자인 제안 → 승인 → 제작 → 시공 → 완료 순서로 진행됩니다. 각 단계별로 고객과 충분한 소통을 통해 만족도 높은 결과를 만들어냅니다.'
  },
  {
    question: '현장 조사는 무료인가요?',
    answer: '기본 현장 조사는 무료로 제공됩니다. 다만 원거리 지역이거나 복잡한 측정이 필요한 경우 별도 비용이 발생할 수 있습니다.'
  },
  {
    question: '디자인 수정은 몇 번까지 가능한가요?',
    answer: '기본적으로 3회까지 수정이 포함되어 있습니다. 추가 수정이 필요한 경우 별도 비용이 발생할 수 있으며, 사전에 안내해드립니다.'
  },
  {
    question: '프로젝트 완료까지 기간은 얼마나 걸리나요?',
    answer: '프로젝트 규모에 따라 다르지만 일반적으로 2-8주 정도 소요됩니다. 복잡한 시공이 필요한 경우 더 오래 걸릴 수 있으니 상담 시 정확한 일정을 안내받아보세요.'
  }
];

export default function EnvDesignPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={envDesignProducts}
      faq={envDesignFaq}
    />
  );
}