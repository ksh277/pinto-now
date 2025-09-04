import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'paper-goods';
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

const paperProducts = [
  { id: 'poster-a3', name: 'A3 포스터', tags: ['포스터', 'A3', '인테리어'], price: 3000, image: '/components/img/placeholder-product.jpg' },
  { id: 'postcard-set', name: '엽서 세트', tags: ['엽서', '세트', '선물'], price: 5000, image: '/components/img/placeholder-product.jpg' },
  { id: 'sticker-sheet', name: '스티커 시트', tags: ['스티커', '다꾸', '데코'], price: 1500, image: '/components/img/placeholder-product.jpg' },
  { id: 'bookmark', name: '북마크', tags: ['북마크', '문구', '실용'], price: 1200, image: '/components/img/placeholder-product.jpg' },
  { id: 'calendar', name: '탁상 달력', tags: ['달력', '실용', '사무'], price: 8000, image: '/components/img/placeholder-product.jpg' },
  { id: 'notebook', name: '맞춤 노트', tags: ['노트', '문구', '개인'], price: 6000, image: '/components/img/placeholder-product.jpg' },
  { id: 'leaflet', name: '리플릿', tags: ['리플릿', '홍보', '업소'], price: 500, image: '/components/img/placeholder-product.jpg' },
  { id: 'business-card', name: '명함', tags: ['명함', '사업', '개인'], price: 20000, image: '/components/img/placeholder-product.jpg' },
  { id: 'wrapping-paper', name: '포장지', tags: ['포장', '선물', '특별'], price: 2000, image: '/components/img/placeholder-product.jpg' },
  { id: 'greeting-card', name: '인사말 카드', tags: ['카드', '인사', '선물'], price: 1800, image: '/components/img/placeholder-product.jpg' }
];

const paperFaq = [
  {
    question: '어떤 종이를 사용하나요?',
    answer: '일반 용지부터 고급 아트지, 펄지, 크라프트지까지 다양한 용지를 지원합니다. 제품과 예산에 맞는 최적의 용지를 추천해드립니다.'
  },
  {
    question: '인쇄 품질은 어떤가요?',
    answer: 'CMYK 4도 인쇄 방식으로 선명하고 정확한 색상 재현이 가능합니다. 특색 인쇄나 형광색 인쇄도 지원합니다.'
  },
  {
    question: '최소 주문 수량이 있나요?',
    answer: '제품에 따라 다릅니다. 스티커나 엽서는 10매부터, 포스터는 1장부터, 명함은 100장부터 주문 가능합니다.'
  },
  {
    question: '후가공 작업이 가능한가요?',
    answer: '라미네이팅, 코팅, 접지, 타공, 재단 등 다양한 후가공 작업을 지원합니다. 제품의 완성도와 내구성을 높일 수 있습니다.'
  },
  {
    question: '친환경 용지 사용이 가능한가요?',
    answer: 'FSC 인증 용지, 재생 용지 등 친환경 용지 옵션을 제공합니다. 환경을 생각하는 고객님들께 추천드립니다.'
  },
  {
    question: '디자인 시 주의사항이 있나요?',
    answer: '재단선, 안전선을 고려한 디자인이 필요합니다. 디자인 가이드를 제공해드리며, 전문 디자이너의 검토도 가능합니다.'
  }
];

export default function PaperGoodsPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={paperProducts}
      faq={paperFaq}
    />
  );
}