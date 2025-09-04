import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'mini-sign';
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

// 미니간판 카테고리 전용 샘플 제품들
const miniSignProducts = [
  { id: 'acrylic-mini-sign-15x20', name: '아크릴 미니간판 15x20cm', tags: ['아크릴', '15x20cm', '투명'], price: 25000, image: '/images/mini-sign/acrylic-mini.png' },
  { id: 'wood-mini-sign-20x25', name: '우드 미니간판 20x25cm', tags: ['우드', '20x25cm', '자연'], price: 30000, image: '/images/mini-sign/wood-mini.png' },
  { id: 'metal-mini-sign-18x24', name: '메탈 미니간판 18x24cm', tags: ['메탈', '18x24cm', '고급'], price: 40000, image: '/images/mini-sign/metal-mini.png' },
  { id: 'chalkboard-mini-15x20', name: '칠판 미니간판 15x20cm', tags: ['칠판', '15x20cm', '변경'], price: 20000, image: '/images/mini-sign/chalkboard-mini.png' },
  { id: 'led-mini-sign-20x15', name: 'LED 미니간판 20x15cm', tags: ['LED', '20x15cm', '발광'], price: 65000, image: '/images/mini-sign/led-mini.png' },
  { id: 'hanging-mini-sign-20x30', name: '행잉 미니간판 20x30cm', tags: ['행잉', '20x30cm', '매달기'], price: 35000, image: '/images/mini-sign/hanging-mini.png' }
];

// 미니간판 카테고리 전용 FAQ
const miniSignFaq = [
  {
    question: '미니간판은 주로 어디에 사용하나요?',
    answer: '카페, 음식점, 소규모 매장의 메뉴판이나 안내판으로 사용됩니다. 테이블 위나 카운터에 놓아 사용하기 좋은 크기입니다.'
  },
  {
    question: '실외에서도 사용 가능한가요?',
    answer: '메탈이나 특수 처리된 아크릴 제품은 실외 사용이 가능합니다. 우드 제품은 실내 사용을 권장하며, 실외 사용 시 별도 코팅 처리가 필요합니다.'
  },
  {
    question: '내용 변경이 자주 필요한데 어떤 제품이 좋나요?',
    answer: '칠판 타입이나 마그네틱 보드를 추천합니다. 마커나 분필로 쉽게 내용을 변경할 수 있어 메뉴나 가격 변경이 자주 있는 업소에 적합합니다.'
  },
  {
    question: '스탠드나 거치대도 함께 제공되나요?',
    answer: '네, 기본적으로 아크릴 스탠드나 우드 받침대가 함께 제공됩니다. 벽걸이용 브라켓이나 특수 거치대가 필요한 경우 별도 주문 가능합니다.'
  }
];

export default function MiniSignPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={miniSignProducts}
      faq={miniSignFaq}
    />
  );
}