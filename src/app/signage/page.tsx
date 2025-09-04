import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'signage';
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

// 광고물/사인 카테고리 전용 샘플 제품들
const signageProducts = [
  { id: 'x-banner-60x160', name: 'X배너 60x160cm', tags: ['X배너', '이동형', '간편'], price: 45000, image: '/images/signage/x-banner.png' },
  { id: 'roll-banner-80x200', name: '롤배너 80x200cm', tags: ['롤배너', '휴대용', '전시'], price: 65000, image: '/images/signage/roll-banner.png' },
  { id: 'poster-banner-100x150', name: '포스터 배너 100x150cm', tags: ['포스터', '벽부착', '홍보'], price: 25000, image: '/images/signage/poster-banner.png' },
  { id: 'acrylic-sign-30x40', name: '아크릴 사인 30x40cm', tags: ['아크릴', '고급', '매장'], price: 35000, image: '/images/signage/acrylic-sign.png' },
  { id: 'menu-board-a3', name: '메뉴판 A3사이즈', tags: ['메뉴판', 'A3', '식당'], price: 20000, image: '/images/signage/menu-board.png' },
  { id: 'safety-sign-20x30', name: '안전 표지판 20x30cm', tags: ['안전', '표지판', '주의'], price: 15000, image: '/images/signage/safety-sign.png' }
];

// 광고물/사인 카테고리 전용 FAQ
const signageFaq = [
  {
    question: '실외용과 실내용 사인물의 차이는 무엇인가요?',
    answer: '실외용은 UV차단 코팅과 방수 처리된 소재를 사용합니다. 실내용보다 내구성이 뛰어나지만 비용이 더 높습니다. 설치 환경에 맞는 제품을 선택해주세요.'
  },
  {
    question: '사인물 설치 서비스도 제공하나요?',
    answer: '대형 사인물의 경우 설치 서비스를 제공합니다. 지역에 따라 추가 비용이 발생할 수 있으며, 사전에 현장 확인 후 설치 일정을 조율합니다.'
  },
  {
    question: '디자인 파일이 없는데 제작해주나요?',
    answer: '네, 전문 디자이너가 디자인을 제작해드립니다. 업종과 용도에 맞는 디자인을 제안하며, 수정 작업도 포함됩니다.'
  },
  {
    question: '긴급 제작이 가능한가요?',
    answer: '당일 또는 익일 제작도 가능합니다. 긴급 제작비(30-50% 추가)가 발생하며, 디자인 확정 시간에 따라 완성 시간이 달라집니다.'
  }
];

export default function SignagePage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={signageProducts}
      faq={signageFaq}
    />
  );
}