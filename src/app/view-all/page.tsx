import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'view-all';
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

// 전체보기 카테고리 전용 샘플 제품들 (다양한 카테고리에서 선별)
const viewAllProducts = [
  { id: 'acrylic-keyring-featured', name: '아크릴 키링', tags: ['아크릴', '키링', '인기'], price: 2500, image: '/images/view-all/acrylic-keyring.png' },
  { id: 'pin-button-featured', name: '핀버튼 37mm', tags: ['핀버튼', '37mm', '표준'], price: 1000, image: '/images/view-all/pin-button.png' },
  { id: 'tshirt-featured', name: '맞춤 티셔츠', tags: ['티셔츠', '면100%', '인기'], price: 15000, image: '/images/view-all/tshirt.png' },
  { id: 'mug-featured', name: '도자기 머그컵', tags: ['머그컵', '도자기', '실용'], price: 8000, image: '/images/view-all/mug.png' },
  { id: 'tumbler-featured', name: '스테인리스 텀블러', tags: ['텀블러', '보온', '친환경'], price: 18000, image: '/images/view-all/tumbler.png' },
  { id: 'sticker-featured', name: '다꾸 스티커', tags: ['스티커', '다꾸', '트렌드'], price: 1000, image: '/images/view-all/sticker.png' },
  { id: 'signage-featured', name: 'X배너', tags: ['X배너', '이동형', '홍보'], price: 45000, image: '/images/view-all/x-banner.png' },
  { id: 'towel-featured', name: '스포츠 타월', tags: ['타월', '스포츠', '흡수'], price: 8000, image: '/images/view-all/sports-towel.png' },
  { id: 'clock-featured', name: '벽시계 30cm', tags: ['시계', '인테리어', '실용'], price: 25000, image: '/images/view-all/wall-clock.png' },
  { id: 'umbrella-featured', name: '자동우산', tags: ['우산', '자동', '편리'], price: 20000, image: '/images/view-all/auto-umbrella.png' },
  { id: 'cushion-featured', name: '사각 쿠션', tags: ['쿠션', '인테리어', '편안'], price: 18000, image: '/images/view-all/square-cushion.png' },
  { id: 'standee-featured', name: '골판지 등신대', tags: ['등신대', '이벤트', '포토존'], price: 50000, image: '/images/view-all/standee.png' }
];

// 전체보기 카테고리 전용 FAQ
const viewAllFaq = [
  {
    question: '어떤 종류의 굿즈를 제작할 수 있나요?',
    answer: '아크릴, 직물, 종이, 금속 등 다양한 소재로 키링부터 대형 간판까지 모든 종류의 굿즈 제작이 가능합니다. 원하는 아이디어가 있으시면 언제든 상담받아보세요.'
  },
  {
    question: '카테고리별로 어떻게 나뉘어 있나요?',
    answer: '핀버튼, 티셔츠, 머그컵, 텀블러, 수건, 시계, 우산, 광고물, LED네온, 환경디자인, 미니간판, 반려동물용품, 액자/소품, 쿠션/패브릭, 장례용품, 포장부자재 등으로 세분화되어 있습니다.'
  },
  {
    question: '소량 주문도 가능한가요?',
    answer: '네, 대부분의 제품이 최소 1개부터 주문 가능합니다. 다만 제품별로 최소 주문 수량이 다를 수 있으니 각 상품 페이지를 확인해주세요.'
  },
  {
    question: '어떤 카테고리가 가장 인기가 많나요?',
    answer: '아크릴 키링, 핀버튼, 티셔츠, 머그컵, 스티커가 가장 인기 있는 카테고리입니다. 개인 굿즈와 기념품으로 많이 제작되고 있습니다.'
  },
  {
    question: '전국 어디든 배송 가능한가요?',
    answer: '네, 전국 어디든 배송 가능합니다. 5만원 이상 주문 시 무료배송이며, 도서산간 지역은 추가 배송비가 발생할 수 있습니다.'
  }
];

export default function ViewAllPage() {
  return (
    <CategoryPageTemplate
      mapping={mapping!}
      products={viewAllProducts}
      faq={viewAllFaq}
    />
  );
}