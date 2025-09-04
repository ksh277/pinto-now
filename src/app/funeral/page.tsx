import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'funeral';
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

// 장례용품 카테고리 전용 샘플 제품들
const funeralProducts = [
  { id: 'memorial-ribbon-white', name: '추도 리본 (흰색)', tags: ['리본', '흰색', '추도'], price: 5000, image: '/images/funeral/memorial-ribbon.png' },
  { id: 'condolence-banner-150x50', name: '조화 현수막 150x50cm', tags: ['현수막', '조화', '150x50cm'], price: 25000, image: '/images/funeral/condolence-banner.png' },
  { id: 'memorial-photo-frame-a4', name: '영정 사진 액자 A4', tags: ['영정', '사진', 'A4'], price: 30000, image: '/images/funeral/memorial-photo.png' },
  { id: 'funeral-guest-book', name: '조문객 방명록', tags: ['방명록', '조문', '기록'], price: 15000, image: '/images/funeral/guest-book.png' },
  { id: 'memorial-card-100ea', name: '부고 카드 100매', tags: ['부고', '카드', '100매'], price: 20000, image: '/images/funeral/memorial-card.png' },
  { id: 'funeral-wreath-ribbon', name: '화환 리본', tags: ['화환', '리본', '추모'], price: 8000, image: '/images/funeral/wreath-ribbon.png' }
];

// 장례용품 카테고리 전용 FAQ
const funeralFaq = [
  {
    question: '장례용품 주문 시 급히 제작이 가능한가요?',
    answer: '네, 24시간 내 제작 서비스를 제공합니다. 급한 상황을 고려하여 우선 제작해드리며, 빠른 배송도 지원합니다.'
  },
  {
    question: '전통적인 디자인과 규격을 지키나요?',
    answer: '장례 예법에 맞는 정통 디자인을 기본으로 합니다. 종교나 지역별 관습에 맞춘 맞춤 제작도 가능하니 상담 시 말씀해주세요.'
  },
  {
    question: '부고 카드에는 어떤 내용을 넣을 수 있나요?',
    answer: '고인 정보, 발인 일시, 장소, 상주 정보 등을 포함할 수 있습니다. 격식에 맞는 문구와 레이아웃을 제안해드립니다.'
  },
  {
    question: '배송비나 설치비는 별도인가요?',
    answer: '장례식장 직접 배송은 무료입니다. 현수막이나 대형 제품의 설치가 필요한 경우 사전에 협의하여 진행합니다.'
  }
];

export default function FuneralPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={funeralProducts}
      faq={funeralFaq}
    />
  );
}