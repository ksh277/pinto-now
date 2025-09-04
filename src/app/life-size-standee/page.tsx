import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'life-size-standee';
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

// 등신대 카테고리 전용 샘플 제품들
const standeeProducts = [
  { id: 'cardboard-standee-160cm', name: '골판지 등신대 160cm', tags: ['골판지', '160cm', '경제적'], price: 45000, image: '/images/life-size-standee/cardboard-160.png' },
  { id: 'cardboard-standee-170cm', name: '골판지 등신대 170cm', tags: ['골판지', '170cm', '표준'], price: 50000, image: '/images/life-size-standee/cardboard-170.png' },
  { id: 'cardboard-standee-180cm', name: '골판지 등신대 180cm', tags: ['골판지', '180cm', '대형'], price: 55000, image: '/images/life-size-standee/cardboard-180.png' },
  { id: 'pvc-standee-160cm', name: 'PVC 등신대 160cm', tags: ['PVC', '160cm', '내구성'], price: 80000, image: '/images/life-size-standee/pvc-160.png' },
  { id: 'pvc-standee-170cm', name: 'PVC 등신대 170cm', tags: ['PVC', '170cm', '고급'], price: 85000, image: '/images/life-size-standee/pvc-170.png' },
  { id: 'custom-shape-standee', name: '맞춤형 등신대', tags: ['맞춤', '특수형태', '프리미엄'], price: 120000, image: '/images/life-size-standee/custom-shape.png' }
];

// 등신대 카테고리 전용 FAQ
const standeeFaq = [
  {
    question: '골판지와 PVC 등신대의 차이점은 무엇인가요?',
    answer: '골판지는 실내 단기 이벤트에 적합하고 가격이 저렴합니다. PVC는 내구성이 뛰어나 장기간 사용하거나 야외에서도 사용 가능하며 반복 사용할 수 있습니다.'
  },
  {
    question: '등신대 제작 시 필요한 사진 규격은 어떻게 되나요?',
    answer: '전신 사진이 필요하며, 해상도는 최소 300dpi 이상을 권장합니다. 배경이 단순하고 인물이 명확한 사진일수록 더 좋은 결과물을 얻을 수 있습니다.'
  },
  {
    question: '등신대 배송은 어떻게 이루어지나요?',
    answer: '완성품은 접혀서 배송되며, 조립용 받침대가 함께 제공됩니다. 대형 상품이므로 별도의 배송비가 발생하며, 전국 배송 가능합니다.'
  },
  {
    question: '이벤트용 대량 주문 시 할인 혜택이 있나요?',
    answer: '10개 이상 주문 시 10% 할인, 20개 이상 주문 시 15% 할인 혜택을 제공합니다. 기업 이벤트나 행사용 대량 주문을 환영합니다.'
  }
];

export default function LifeSizeStandeePage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={standeeProducts}
      faq={standeeFaq}
    />
  );
}