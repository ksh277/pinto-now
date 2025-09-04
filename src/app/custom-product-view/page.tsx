import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'custom-product-view';
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

const customProducts = [
  { id: 'custom-keyring', name: '맞춤 키링', tags: ['커스텀', '개인', '키링'], price: 3000, image: '/images/placeholder-product.jpg' },
  { id: 'custom-phone-case', name: '맞춤 폰케이스', tags: ['폰케이스', '개인', '실용'], price: 12000, image: '/images/placeholder-product.jpg' },
  { id: 'custom-notebook', name: '맞춤 노트북', tags: ['노트북', '문구', '개인'], price: 8000, image: '/images/placeholder-product.jpg' },
  { id: 'custom-bag', name: '맞춤 에코백', tags: ['에코백', '친환경', '실용'], price: 15000, image: '/images/placeholder-product.jpg' },
  { id: 'custom-calendar', name: '맞춤 달력', tags: ['달력', '사진', '기념품'], price: 18000, image: '/images/placeholder-product.jpg' },
  { id: 'custom-puzzle', name: '맞춤 퍼즐', tags: ['퍼즐', '놀이', '사진'], price: 25000, image: '/images/placeholder-product.jpg' }
];

const customFaq = [
  {
    question: '어떤 이미지든 제품으로 만들 수 있나요?',
    answer: '네, 고해상도 이미지라면 어떤 이미지든 제품으로 제작 가능합니다. 다만 저작권이 있는 이미지는 사용에 제한이 있을 수 있습니다.'
  },
  {
    question: '디자인 파일이 없어도 제작할 수 있나요?',
    answer: '물론입니다! 아이디어나 텍스트만 주시면 전문 디자이너가 맞춤 디자인을 제작해드립니다. 추가 디자인 비용이 발생할 수 있습니다.'
  },
  {
    question: '샘플을 먼저 확인할 수 있나요?',
    answer: '유료 샘플 제작 서비스를 제공합니다. 샘플 비용은 본 주문 시 전액 차감되므로 부담 없이 이용하실 수 있습니다.'
  },
  {
    question: '최소 주문 수량이 있나요?',
    answer: '대부분의 맞춤 제품은 1개부터 주문 가능합니다. 단, 일부 제품은 최소 주문 수량이 있을 수 있으니 상품별로 확인해주세요.'
  }
];

export default function CustomProductViewPage() {
  return (
    <CategoryPageTemplate 
      mapping={safeMapping}
      products={customProducts}
      faq={customFaq}
    />
  );
}