import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'promo-product-view';
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

const promoProducts = [
  { id: 'promo-pen', name: '판촉용 볼펜', tags: ['볼펜', '판촉', '대량'], price: 500, image: '/images/placeholder-product.jpg' },
  { id: 'promo-notepad', name: '판촉용 메모지', tags: ['메모지', '사무용품', '대량'], price: 300, image: '/images/placeholder-product.jpg' },
  { id: 'promo-usb', name: '판촉용 USB', tags: ['USB', 'IT', '기업'], price: 8000, image: '/images/placeholder-product.jpg' },
  { id: 'promo-tumbler', name: '판촉용 텀블러', tags: ['텀블러', '실용', '친환경'], price: 12000, image: '/images/placeholder-product.jpg' },
  { id: 'promo-bag', name: '판촉용 에코백', tags: ['에코백', '친환경', '실용'], price: 3000, image: '/images/placeholder-product.jpg' },
  { id: 'promo-powerbank', name: '판촉용 보조배터리', tags: ['보조배터리', 'IT', '실용'], price: 15000, image: '/images/placeholder-product.jpg' }
];

const promoFaq = [
  {
    question: '최소 주문 수량은 얼마인가요?',
    answer: '판촉용 상품은 일반적으로 100개부터 주문 가능하며, 상품에 따라 최소 주문 수량이 다를 수 있습니다. 대량 주문 시 더 큰 할인 혜택을 받으실 수 있습니다.'
  },
  {
    question: '로고나 회사명을 넣을 수 있나요?',
    answer: '네, 모든 판촉용 상품에 로고, 회사명, 연락처 등을 인쇄할 수 있습니다. 다양한 인쇄 방식으로 최적의 결과물을 제작해드립니다.'
  },
  {
    question: '납기는 얼마나 걸리나요?',
    answer: '디자인 확정 후 5-7 영업일이 소요됩니다. 급한 일정이 있으시면 특급 제작 서비스도 이용 가능합니다. (추가 비용 발생)'
  },
  {
    question: '세금계산서 발행이 가능한가요?',
    answer: '네, 법인 및 개인사업자 대상으로 세금계산서 발행이 가능합니다. 주문 시 사업자등록증을 제출해주시면 됩니다.'
  },
  {
    question: '전국 배송이 가능한가요?',
    answer: '전국 어디든 배송 가능하며, 대량 주문 시 무료배송입니다. 도서산간 지역은 추가 배송비가 발생할 수 있습니다.'
  }
];

export default function PromoProductViewPage() {
  return (
    <CategoryPageTemplate 
      mapping={safeMapping}
      products={promoProducts}
      faq={promoFaq}
    />
  );
}