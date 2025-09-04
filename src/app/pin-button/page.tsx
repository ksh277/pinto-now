import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'pin-button';
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

// 핀버튼 카테고리 전용 샘플 제품들
const pinButtonProducts = [
  { id: 'pin-25mm', name: '25mm 핀버튼', tags: ['25mm', '소형', '인기'], price: 800, image: '/images/pin-button/25mm-pin.png' },
  { id: 'pin-37mm', name: '37mm 핀버튼', tags: ['37mm', '중형', '표준'], price: 1000, image: '/images/pin-button/37mm-pin.png' },
  { id: 'pin-57mm', name: '57mm 핀버튼', tags: ['57mm', '대형', '임팩트'], price: 1500, image: '/images/pin-button/57mm-pin.png' },
  { id: 'pin-75mm', name: '75mm 핀버튼', tags: ['75mm', '특대형', '강조'], price: 2000, image: '/images/pin-button/75mm-pin.png' },
  { id: 'pin-hologram', name: '홀로그램 핀버튼', tags: ['홀로그램', '특수', '프리미엄'], price: 2500, image: '/images/pin-button/hologram-pin.png' },
  { id: 'pin-glow', name: '야광 핀버튼', tags: ['야광', '어둠', '특별'], price: 2200, image: '/images/pin-button/glow-pin.png' }
];

// 핀버튼 카테고리 전용 FAQ
const pinButtonFaq = [
  {
    question: '핀버튼 사이즈별 용도는 어떻게 다른가요?',
    answer: '25mm는 가방이나 모자 포인트용, 37mm는 가장 인기있는 표준 사이즈, 57mm는 이벤트나 홍보용, 75mm는 컬렉션이나 강한 인상을 주고 싶을 때 사용합니다.'
  },
  {
    question: '핀버튼 최소 주문 수량은 얼마인가요?',
    answer: '모든 사이즈 10개부터 주문 가능합니다. 소량 주문도 부담 없이 제작할 수 있어 개인 굿즈나 소규모 이벤트에 적합합니다.'
  },
  {
    question: '특수 효과(홀로그램, 야광) 추가 비용은 얼마인가요?',
    answer: '홀로그램은 개당 500원, 야광은 개당 300원의 추가 비용이 있습니다. 특수 효과는 더욱 임팩트 있는 핀버튼을 원할 때 추천합니다.'
  },
  {
    question: '핀버튼 뒷면 마감은 어떻게 되나요?',
    answer: '안전핀 타입이 기본이며, 마그넷 타입이나 브로치핀 타입도 선택 가능합니다. 용도에 맞는 뒷면 마감을 선택해주세요.'
  }
];

export default function PinButtonPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={pinButtonProducts}
      faq={pinButtonFaq}
    />
  );
}