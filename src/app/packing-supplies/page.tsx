import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'packing-supplies';
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

// 포장 부자재 카테고리 전용 샘플 제품들
const packingSuppliesProducts = [
  { id: 'gift-box-small-10x10', name: '선물상자 소형 10x10cm', tags: ['선물상자', '10x10cm', '소형'], price: 1500, image: '/images/packing-supplies/gift-box-small.png' },
  { id: 'gift-box-medium-15x15', name: '선물상자 중형 15x15cm', tags: ['선물상자', '15x15cm', '중형'], price: 2000, image: '/images/packing-supplies/gift-box-medium.png' },
  { id: 'bubble-wrap-30x40', name: '에어캡 30x40cm (50매)', tags: ['에어캡', '30x40cm', '보호'], price: 8000, image: '/images/packing-supplies/bubble-wrap.png' },
  { id: 'packing-paper-kraft', name: '포장지 크라프트 (10매)', tags: ['포장지', '크라프트', '친환경'], price: 5000, image: '/images/packing-supplies/kraft-paper.png' },
  { id: 'shipping-box-20x15x10', name: '택배박스 20x15x10cm', tags: ['택배박스', '20x15x10cm', '배송'], price: 800, image: '/images/packing-supplies/shipping-box.png' },
  { id: 'packing-tape-custom', name: '맞춤 포장테이프', tags: ['포장테이프', '맞춤', '브랜딩'], price: 12000, image: '/images/packing-supplies/custom-tape.png' }
];

// 포장 부자재 카테고리 전용 FAQ
const packingSuppliesFaq = [
  {
    question: '포장 부자재만 단독으로 주문할 수 있나요?',
    answer: '네, 포장 부자재만 별도로 주문 가능합니다. 다양한 사이즈와 수량으로 제공하며, 대량 주문 시 할인 혜택도 있습니다.'
  },
  {
    question: '맞춤 포장테이프에는 어떤 디자인을 넣을 수 있나요?',
    answer: '회사 로고, 브랜드명, 연락처, 특별 메시지 등을 넣을 수 있습니다. 단색 또는 2색 인쇄가 가능하며, 최소 주문 수량이 있습니다.'
  },
  {
    question: '친환경 포장재도 있나요?',
    answer: '네, 재활용 가능한 크라프트지, 생분해 포장재, FSC 인증 종이박스 등 다양한 친환경 옵션을 제공합니다.'
  },
  {
    question: '대량 주문 시 할인 혜택은 어떻게 되나요?',
    answer: '수량별로 5-20%까지 할인 혜택을 제공합니다. 정확한 할인율과 최소 주문 수량은 상품별로 다르니 상담받아보세요.'
  }
];

export default function PackingSuppliesPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={packingSuppliesProducts}
      faq={packingSuppliesFaq}
    />
  );
}