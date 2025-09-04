import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'all';
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

// ALL 카테고리 전용 샘플 제품들
const allProducts = [
  { id: 'acrylic-keyring-all', name: '아크릴 키링', tags: ['아크릴', '키링', '인기'], price: 2500, image: '/components/img/placeholder-product.jpg' },
  { id: 'tshirt-all', name: '커스텀 티셔츠', tags: ['의류', '티셔츠', '개인'], price: 15000, image: '/components/img/placeholder-product.jpg' },
  { id: 'mug-all', name: '머그컵', tags: ['머그', '실용', '선물'], price: 8000, image: '/components/img/placeholder-product.jpg' },
  { id: 'sticker-all', name: '다꾸 스티커', tags: ['스티커', '다꾸', '트렌드'], price: 1000, image: '/components/img/placeholder-product.jpg' },
  { id: 'fan-goods-all', name: '팬굿즈 세트', tags: ['팬굿즈', '응원', '한정'], price: 25000, image: '/components/img/placeholder-product.jpg' },
  { id: 'tumbler-all', name: '보온 텀블러', tags: ['텐블러', '보온', '실용'], price: 18000, image: '/components/img/placeholder-product.jpg' },
  { id: 'signage-all', name: '맞춤 간판', tags: ['간판', '사인', '업소'], price: 50000, image: '/components/img/placeholder-product.jpg' },
  { id: 'frame-all', name: '아크릴 액자', tags: ['액자', '인테리어', '프리미엄'], price: 12000, image: '/components/img/placeholder-product.jpg' },
  { id: 'cushion-all', name: '쿠션', tags: ['쿠션', '인테리어', '선물'], price: 22000, image: '/components/img/placeholder-product.jpg' },
  { id: 'pin-all', name: '핀 버튼', tags: ['핀', '버튼', '소량'], price: 800, image: '/components/img/placeholder-product.jpg' },
  { id: 'standee-all', name: '등신대', tags: ['등신대', '이벤트', '대형'], price: 80000, image: '/components/img/placeholder-product.jpg' },
  { id: 'clock-all', name: '벽시계', tags: ['시계', '인테리어', '실용'], price: 35000, image: '/components/img/placeholder-product.jpg' }
];

// ALL 카테고리 전용 FAQ
const allFaq = [
  {
    question: '어떤 종류의 굿즈를 제작할 수 있나요?',
    answer: '아크릴, 직물, 종이, 금속 등 다양한 소재로 키링부터 대형 간판까지 모든 종류의 굿즈 제작이 가능합니다. 원하는 아이디어가 있으시면 언제든 상담받아보세요.'
  },
  {
    question: '소량 주문도 가능한가요?',
    answer: '네, 대부분의 제품이 최소 1개부터 주문 가능합니다. 다만 제품별로 최소 주문 수량이 다를 수 있으니 각 상품 페이지를 확인해주세요.'
  },
  {
    question: '디자인 파일은 어떤 형식으로 제출하나요?',
    answer: 'AI, PSD, PNG, JPG 등 다양한 형식을 지원합니다. 해상도는 300dpi 이상을 권장하며, 디자인이 없으시면 전문 디자이너가 제작을 도와드립니다.'
  },
  {
    question: '전국 어디든 배송 가능한가요?',
    answer: '네, 전국 어디든 배송 가능합니다. 5만원 이상 주문 시 무료배송이며, 도서산간 지역은 추가 배송비가 발생할 수 있습니다.'
  },
  {
    question: '대량 주문 할인 혜택이 있나요?',
    answer: '수량에 따른 단계별 할인 혜택을 제공합니다. 100개 이상 주문 시 최대 30% 할인 가능하며, 정확한 할인율은 상품별로 다릅니다.'
  },
  {
    question: '제작 샘플을 먼저 확인할 수 있나요?',
    answer: '유료 샘플 제작 서비스를 제공합니다. 샘플 비용은 본 주문 시 차감되며, 대량 주문의 경우 무료 샘플 제작도 가능합니다.'
  }
];

export default function AllPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={allProducts}
      faq={allFaq}
    />
  );
}