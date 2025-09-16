import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'promo';
const mapping = getCategoryMapping(categorySlug);

const safeMapping = mapping || {
  slug: 'promo',
  categoryKo: '단체 판촉상품',
  type: 'category' as const,
  subtitle: '대량 주문 전용 판촉 상품',
  description: '기업 및 단체를 위한 대량 주문 전용 판촉 상품을 합리적인 가격에 제작하세요.',
  usp: [
    { icon: '📦', title: '대량 할인', desc: '수량이 많을수록 더 저렴한 단가' },
    { icon: '🏢', title: '기업 전용', desc: '세금계산서 발행 가능' },
    { icon: '🎯', title: '맞춤 제작', desc: '로고 및 디자인 무료 인쇄' }
  ],
  heroImagePath: '/images/default-hero.png'
};

export const metadata: Metadata = {
  title: `${safeMapping.categoryKo} | PINTO`,
  description: safeMapping.description,
  alternates: {
    canonical: `https://pinto.co.kr/${safeMapping.slug}`
  },
  openGraph: {
    title: `${safeMapping.categoryKo} | PINTO`,
    description: safeMapping.description,
    url: `https://pinto.co.kr/${safeMapping.slug}`,
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: safeMapping.heroImagePath,
        width: 1200,
        height: 630,
        alt: `${safeMapping.categoryKo} 메인 이미지`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${safeMapping.categoryKo} | PINTO`,
    description: safeMapping.description,
    images: [safeMapping.heroImagePath]
  }
};

// 단체 판촉상품 카테고리 전용 샘플 제품들
const promoProducts: any[] = [];

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
  // mapping이 없을 경우 에러 로깅
  if (!mapping) {
    console.error(`Category mapping not found for: ${categorySlug}`);
  }

  return (
    <CategoryPageTemplate 
      mapping={safeMapping}
      products={promoProducts}
      faq={promoFaq}
    />
  );
}