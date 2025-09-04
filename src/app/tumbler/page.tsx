import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'tumbler';
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

// 텀블러 카테고리 전용 샘플 제품들
const tumblerProducts = [
  { id: 'stainless-tumbler-350ml', name: '스테인리스 텀블러 350ml', tags: ['스테인리스', '350ml', '기본'], price: 15000, image: '/images/tumbler/stainless-350.png' },
  { id: 'stainless-tumbler-500ml', name: '스테인리스 텀블러 500ml', tags: ['스테인리스', '500ml', '대용량'], price: 18000, image: '/images/tumbler/stainless-500.png' },
  { id: 'vacuum-tumbler-450ml', name: '진공 텀블러 450ml', tags: ['진공', '450ml', '보온'], price: 22000, image: '/images/tumbler/vacuum-450.png' },
  { id: 'eco-tumbler-400ml', name: '친환경 텀블러 400ml', tags: ['친환경', '400ml', '재활용'], price: 16000, image: '/images/tumbler/eco-400.png' },
  { id: 'sports-tumbler-600ml', name: '스포츠 텀블러 600ml', tags: ['스포츠', '600ml', '운동'], price: 25000, image: '/images/tumbler/sports-600.png' },
  { id: 'premium-tumbler-450ml', name: '프리미엄 텀블러 450ml', tags: ['프리미엄', '450ml', '고급'], price: 30000, image: '/images/tumbler/premium-450.png' }
];

// 텀블러 카테고리 전용 FAQ
const tumblerFaq = [
  {
    question: '텀블러 보온/보냉 시간은 어느 정도인가요?',
    answer: '일반 스테인리스는 6시간, 진공 텀블러는 12시간, 프리미엄 모델은 24시간까지 온도 유지가 가능합니다.'
  },
  {
    question: '텀블러에 인쇄할 수 있는 영역은 어디인가요?',
    answer: '몸체 전면, 후면 모두 인쇄 가능하며, 레이저 각인이나 실크스크린 인쇄를 선택할 수 있습니다. 손잡이 부분은 인쇄가 어렵습니다.'
  },
  {
    question: '뚜껑은 어떤 타입인가요?',
    answer: '기본 플립탑, 빨대형, 원터치형 등 다양한 뚜껑 타입을 선택할 수 있습니다. 용도에 맞는 뚜껑을 선택해주세요.'
  },
  {
    question: '친환경 인증 제품인가요?',
    answer: '친환경 텀블러는 재활용 가능한 소재를 사용하며, 관련 인증을 받은 제품입니다. 일회용컵 사용을 줄이는 환경보호에 동참하실 수 있습니다.'
  }
];

export default function TumblerPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={tumblerProducts}
      faq={tumblerFaq}
    />
  );
}