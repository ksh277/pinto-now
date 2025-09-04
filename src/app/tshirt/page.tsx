import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'tshirt';
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

// 티셔츠 카테고리 전용 샘플 제품들
const tshirtProducts = [
  { id: 'cotton-tshirt-basic', name: '기본 면 티셔츠', tags: ['면100%', '기본', '편안'], price: 15000, image: '/images/tshirt/cotton-basic.png' },
  { id: 'poly-cotton-tshirt', name: '면폴리 혼방 티셔츠', tags: ['혼방', '내구성', '관리'], price: 12000, image: '/images/tshirt/poly-cotton.png' },
  { id: 'premium-cotton-tshirt', name: '프리미엄 면 티셔츠', tags: ['고급면', '부드러움', '프리미엄'], price: 25000, image: '/images/tshirt/premium-cotton.png' },
  { id: 'oversized-tshirt', name: '오버사이즈 티셔츠', tags: ['오버핏', '트렌드', '여유'], price: 20000, image: '/images/tshirt/oversized.png' },
  { id: 'long-sleeve-tshirt', name: '긴팔 티셔츠', tags: ['긴팔', '사계절', '활용'], price: 18000, image: '/images/tshirt/long-sleeve.png' },
  { id: 'v-neck-tshirt', name: 'V넥 티셔츠', tags: ['V넥', '심플', '깔끔'], price: 16000, image: '/images/tshirt/v-neck.png' }
];

// 티셔츠 카테고리 전용 FAQ
const tshirtFaq = [
  {
    question: '티셔츠 인쇄 방식은 어떤 것들이 있나요?',
    answer: '실크스크린, DTG(디지털), 열전사, 자수 방식이 있습니다. 실크스크린은 대량 제작에, DTG는 소량 다색 인쇄에, 자수는 고급 마감에 적합합니다.'
  },
  {
    question: '사이즈는 어떻게 선택하나요?',
    answer: 'XS부터 3XL까지 다양한 사이즈를 제공합니다. 상품 페이지의 사이즈 차트를 참고하시거나 기존 착용 티셔츠 치수를 측정해서 비교해보세요.'
  },
  {
    question: '세탁 시 인쇄가 벗겨지지 않나요?',
    answer: '적절한 인쇄 방식과 고품질 잉크 사용으로 일반적인 세탁에서는 문제없습니다. 뒤집어서 세탁하시고 건조기 사용 시 낮은 온도로 설정해주세요.'
  },
  {
    question: '색상별로 가격 차이가 있나요?',
    answer: '기본 색상(흰색, 검정, 회색 등)은 동일 가격이며, 형광색이나 특수색은 약간의 추가 비용이 있을 수 있습니다.'
  }
];

export default function TshirtPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={tshirtProducts}
      faq={tshirtFaq}
    />
  );
}