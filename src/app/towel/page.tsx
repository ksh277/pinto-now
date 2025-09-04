import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'towel';
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

// 수건 카테고리 전용 샘플 제품들
const towelProducts = [
  { id: 'sports-towel-35x80', name: '스포츠 타월 35x80cm', tags: ['스포츠', '35x80cm', '운동'], price: 8000, image: '/images/towel/sports-towel.png' },
  { id: 'gym-towel-40x100', name: '헬스장 수건 40x100cm', tags: ['헬스', '40x100cm', '대형'], price: 12000, image: '/images/towel/gym-towel.png' },
  { id: 'microfiber-towel-30x70', name: '마이크로화이버 수건 30x70cm', tags: ['마이크로화이버', '속건', '여행'], price: 10000, image: '/images/towel/microfiber.png' },
  { id: 'golf-towel-30x40', name: '골프 타월 30x40cm', tags: ['골프', '30x40cm', '클립'], price: 15000, image: '/images/towel/golf-towel.png' },
  { id: 'cooling-towel-30x90', name: '쿨링 타월 30x90cm', tags: ['쿨링', '시원함', '여름'], price: 18000, image: '/images/towel/cooling-towel.png' },
  { id: 'antibacterial-towel-40x80', name: '항균 수건 40x80cm', tags: ['항균', '위생', '안전'], price: 14000, image: '/images/towel/antibacterial.png' }
];

// 수건 카테고리 전용 FAQ
const towelFaq = [
  {
    question: '수건 인쇄는 어떤 방식으로 하나요?',
    answer: '자수, 실크스크린, 열전사 방식을 사용합니다. 자수가 가장 고급스럽고 내구성이 좋으며, 실크스크린은 선명한 색상 표현이 가능합니다.'
  },
  {
    question: '항균 처리는 추가 비용이 있나요?',
    answer: '항균 처리는 개당 1,000원의 추가 비용이 있습니다. 은이온 항균 처리로 세탁 후에도 항균 효과가 지속됩니다.'
  },
  {
    question: '수건 세탁 시 주의사항이 있나요?',
    answer: '첫 세탁 시 단독 세탁을 권장하며, 자수 부분은 뒤집어서 세탁해주세요. 표백제 사용은 피해주시고 중간 온도로 건조해주세요.'
  },
  {
    question: '대량 주문 시 포장은 어떻게 되나요?',
    answer: '개별 비닐 포장이 기본이며, 선물용 박스 포장도 가능합니다. 50개 이상 주문 시 단체 포장 박스를 무료로 제공합니다.'
  }
];

export default function TowelPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={towelProducts}
      faq={towelFaq}
    />
  );
}