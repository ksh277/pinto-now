import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'promo';
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

// 단체 판촉상품 카테고리 전용 샘플 제품들
const promoProducts = [
  { id: 'promo-tote-bag', name: '판촉용 에코백', tags: ['에코백', '대량', 'B2B'], price: 3500, image: '/images/promo/tote-bag.png' },
  { id: 'promo-pen', name: '기업 볼펜', tags: ['볼펜', '실용', '로고'], price: 800, image: '/images/promo/pen.png' },
  { id: 'promo-notebook', name: '판촉용 노트', tags: ['노트', '업무', '기업'], price: 2500, image: '/images/promo/notebook.png' },
  { id: 'promo-usb', name: '기업용 USB', tags: ['USB', '실용', '기술'], price: 8000, image: '/images/promo/usb.png' },
  { id: 'promo-tumbler-bulk', name: '대량 텀블러', tags: ['텀블러', '친환경', '대량'], price: 12000, image: '/images/promo/tumbler-bulk.png' },
  { id: 'promo-keyring-bulk', name: '판촉용 키링', tags: ['키링', '소량단가', '기념품'], price: 1200, image: '/images/promo/keyring-bulk.png' }
];

// 단체 판촉상품 카테고리 전용 FAQ
const promoFaq = [
  {
    question: '판촉용 대량 주문 최소 수량은 얼마인가요?',
    answer: '상품별로 다르지만 일반적으로 100개부터 주문 가능합니다. 수량이 많을수록 더 좋은 단가 혜택을 받으실 수 있습니다.'
  },
  {
    question: '대량 주문 시 할인율은 어떻게 되나요?',
    answer: '100개 이상 10% 할인, 500개 이상 15% 할인, 1000개 이상 20% 할인, 5000개 이상 25% 할인 혜택을 제공합니다.'
  },
  {
    question: '기업 로고 인쇄는 추가 비용이 있나요?',
    answer: '대량 주문의 경우 로고 인쇄비는 무료입니다. 단색 로고가 기본이며, 다색 로고는 색상별 추가 비용이 발생할 수 있습니다.'
  },
  {
    question: '판촉용 상품 제작 기간은 얼마나 걸리나요?',
    answer: '일반적으로 7-14일 정도 소요되며, 수량과 상품 복잡도에 따라 달라집니다. 급한 일정이 있으시면 상담 시 알려주세요.'
  },
  {
    question: '세금계산서 발행이 가능한가요?',
    answer: '네, 기업 고객을 위한 세금계산서 발행이 가능합니다. 사업자등록증을 제출해주시면 정식 세금계산서로 처리해드립니다.'
  }
];

export default function PromoPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={promoProducts}
      faq={promoFaq}
    />
  );
}