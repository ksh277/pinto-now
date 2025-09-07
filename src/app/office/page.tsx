import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'office';
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

const officeProducts = [
  { id: 'office-pen', name: '맞춤 볼펜', tags: ['볼펜', '문구', '실용'], price: 2000, image: '/images/placeholder-product.jpg' },
  { id: 'office-notebook', name: '맞춤 노트', tags: ['노트', '업무', '기록'], price: 5000, image: '/images/placeholder-product.jpg' },
  { id: 'office-calendar', name: '탁상 달력', tags: ['달력', '일정', '오피스'], price: 8000, image: '/images/placeholder-product.jpg' },
  { id: 'office-mousepad', name: '마우스패드', tags: ['마우스패드', 'IT', '업무'], price: 12000, image: '/images/placeholder-product.jpg' },
  { id: 'office-folder', name: '파일 폴더', tags: ['폴더', '정리', '문서'], price: 3000, image: '/images/placeholder-product.jpg' },
  { id: 'office-sticky', name: '맞춤 포스트잇', tags: ['포스트잇', '메모', '업무'], price: 4000, image: '/images/placeholder-product.jpg' }
];

const officeFaq = [
  {
    question: '사무용품에 회사 로고를 넣을 수 있나요?',
    answer: '네, 모든 문구/오피스 제품에 회사 로고, 브랜딩을 적용할 수 있습니다. 다양한 인쇄 방식으로 고품질 결과물을 제작해드립니다.'
  },
  {
    question: '대량 주문 시 할인 혜택이 있나요?',
    answer: '100개 이상 주문 시 수량별 할인을 적용해드립니다. 500개 이상 대량 주문 시 특별 할인가로 제작 가능합니다.'
  },
  {
    question: '품질은 어떤가요?',
    answer: '업무용으로 사용하기에 충분한 고품질 소재만을 사용합니다. 일반 문구점 제품과 동등하거나 더 우수한 품질을 보장합니다.'
  },
  {
    question: '제작 기간은 얼마나 걸리나요?',
    answer: '디자인 확정 후 5-7 영업일이 소요됩니다. 급한 일정이 있으시면 특급 제작 서비스도 이용 가능합니다.'
  }
];

export default function OfficePage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={officeProducts}
      faq={officeFaq}
    />
  );
}