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

// ETC 카테고리 전용 샘플 제품들
const etcProducts = [
  { id: 'custom-shaped-goods', name: '맞춤형 굿즈', tags: ['맞춤', '특별제작', '독특'], price: 15000, image: '/images/etc/custom-shaped.png' },
  { id: 'special-material', name: '특수 소재 굿즈', tags: ['특수소재', '프리미엄', '한정'], price: 25000, image: '/images/etc/special-material.png' },
  { id: 'limited-edition', name: '한정판 아이템', tags: ['한정판', '콜렉터블', '희귀'], price: 50000, image: '/images/etc/limited-edition.png' },
  { id: 'experimental-goods', name: '실험적 굿즈', tags: ['실험적', '아트', '창작'], price: 30000, image: '/images/etc/experimental.png' },
  { id: 'unusual-item', name: '특이한 아이템', tags: ['특이함', '화제성', '독창성'], price: 20000, image: '/images/etc/unusual-item.png' },
  { id: 'concept-goods', name: '컨셉 굿즈', tags: ['컨셉', '테마', '스토리'], price: 35000, image: '/images/etc/concept-goods.png' }
];

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