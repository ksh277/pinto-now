import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'cushion-fabric';
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

// 쿠션/방석/패브릭 제품 카테고리 전용 샘플 제품들
const cushionFabricProducts = [
  { id: 'square-cushion-40x40', name: '사각 쿠션 40x40cm', tags: ['사각', '40x40cm', '기본'], price: 18000, image: '/images/cushion-fabric/square-cushion.png' },
  { id: 'round-cushion-35cm', name: '원형 쿠션 지름 35cm', tags: ['원형', '35cm', '둥근'], price: 20000, image: '/images/cushion-fabric/round-cushion.png' },
  { id: 'floor-cushion-50x50', name: '바닥 방석 50x50cm', tags: ['바닥', '50x50cm', '두꺼움'], price: 25000, image: '/images/cushion-fabric/floor-cushion.png' },
  { id: 'back-cushion-45x35', name: '등받이 쿠션 45x35cm', tags: ['등받이', '45x35cm', '지지'], price: 22000, image: '/images/cushion-fabric/back-cushion.png' },
  { id: 'memory-foam-cushion', name: '메모리폼 쿠션', tags: ['메모리폼', '고급', '편안'], price: 35000, image: '/images/cushion-fabric/memory-foam.png' },
  { id: 'fabric-pouch-large', name: '패브릭 파우치 대형', tags: ['패브릭', '파우치', '수납'], price: 15000, image: '/images/cushion-fabric/fabric-pouch.png' }
];

// 쿠션/방석/패브릭 제품 카테고리 전용 FAQ
const cushionFabricFaq = [
  {
    question: '쿠션 소재는 어떤 것들이 있나요?',
    answer: '면, 린넨, 벨벳, 마이크로파이버 등 다양한 원단을 사용합니다. 용도에 따라 최적의 원단을 추천해드리며, 알레르기가 있으신 분은 사전에 말씀해주세요.'
  },
  {
    question: '쿠션 속재는 무엇을 사용하나요?',
    answer: '기본 솜, 메모리폼, 라텍스 등을 사용합니다. 메모리폼은 체형에 맞춰 변형되어 편안함이 뛰어나고, 라텍스는 탄력성이 좋습니다.'
  },
  {
    question: '세탁이 가능한가요?',
    answer: '대부분의 제품이 손세탁 또는 드라이클리닝 가능합니다. 세탁 방법은 제품별로 다르니 완성 후 제공되는 세탁 가이드를 참고해주세요.'
  },
  {
    question: '맞춤 사이즈 제작이 가능한가요?',
    answer: '네, 원하는 사이즈로 맞춤 제작 가능합니다. 최소 20x20cm부터 최대 80x80cm까지 제작할 수 있으며, 특수 사이즈는 별도 상담이 필요합니다.'
  }
];

export default function CushionFabricPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={cushionFabricProducts}
      faq={cushionFabricFaq}
    />
  );
}