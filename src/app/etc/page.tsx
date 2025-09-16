import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'etc';
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

const etcProducts: any[] = [];

// ETC 카테고리 전용 FAQ
const etcFaq = [
  {
    question: 'ETC 카테고리에는 어떤 제품들이 포함되나요?',
    answer: '일반적인 카테고리에 속하지 않는 독특하고 창작적인 모든 굿즈가 포함됩니다. 실험적인 소재, 특수한 형태, 컨셉추얼한 아이템 등을 제작할 수 있습니다.'
  },
  {
    question: '특수한 아이디어가 있는데 제작 가능한가요?',
    answer: '네, 대부분의 창작 아이디어는 구현 가능합니다. 먼저 아이디어를 상담해주시면 기술적 검토 후 최적의 제작 방안을 제안해드립니다.'
  },
  {
    question: 'ETC 상품의 제작 기간은 얼마나 걸리나요?',
    answer: '일반 상품보다 제작 기간이 길 수 있습니다. 복잡도에 따라 2-4주 정도 소요되며, 샘플 제작이 필요한 경우 추가 시간이 필요할 수 있습니다.'
  },
  {
    question: '특수 제작 비용은 어떻게 산정되나요?',
    answer: '제작 복잡도, 사용 소재, 수량에 따라 개별 견적을 제공합니다. 아이디어를 먼저 상담해주시면 정확한 비용을 안내해드립니다.'
  }
];

export default function EtcPage() {
  return (
    <CategoryPageTemplate 
      mapping={safeMapping}
      products={etcProducts}
      faq={etcFaq}
    />
  );
}