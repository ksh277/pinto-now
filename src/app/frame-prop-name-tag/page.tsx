import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'frame-prop-name-tag';
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

// 액자/소품/네임택 카테고리 전용 샘플 제품들
const framePropNameTagProducts = [
  { id: 'acrylic-frame-a4', name: '아크릴 액자 A4', tags: ['아크릴', 'A4', '투명'], price: 15000, image: '/images/frame-prop-name-tag/acrylic-frame.png' },
  { id: 'wood-frame-20x25', name: '우드 액자 20x25cm', tags: ['우드', '20x25cm', '자연'], price: 18000, image: '/images/frame-prop-name-tag/wood-frame.png' },
  { id: 'metal-name-tag-rect', name: '메탈 네임택 직사각형', tags: ['메탈', '네임택', '직사각형'], price: 8000, image: '/images/frame-prop-name-tag/metal-nametag.png' },
  { id: 'acrylic-name-tag-round', name: '아크릴 네임택 원형', tags: ['아크릴', '네임택', '원형'], price: 6000, image: '/images/frame-prop-name-tag/acrylic-nametag.png' },
  { id: 'desk-prop-stand', name: '데스크 소품 스탠드', tags: ['데스크', '소품', '스탠드'], price: 12000, image: '/images/frame-prop-name-tag/desk-prop.png' },
  { id: 'memorial-plaque-20x15', name: '기념패 20x15cm', tags: ['기념패', '20x15cm', '기념품'], price: 25000, image: '/images/frame-prop-name-tag/memorial-plaque.png' }
];

// 액자/소품/네임택 카테고리 전용 FAQ
const framePropNameTagFaq = [
  {
    question: '액자에는 어떤 사진을 넣을 수 있나요?',
    answer: '개인 사진, 회사 로고, 인증서, 상장 등 다양한 용도로 사용 가능합니다. 디지털 파일로 제출하시면 고품질 인쇄로 제작해드립니다.'
  },
  {
    question: '네임택은 어떤 용도로 사용하나요?',
    answer: '직원 이름표, 회의용 네임택, 이벤트용 배지 등으로 사용됩니다. 자석형, 핀형, 클립형 등 다양한 착용 방식을 선택할 수 있습니다.'
  },
  {
    question: '기념품으로 제작할 때 포장은 어떻게 되나요?',
    answer: '개별 선물 포장이 가능합니다. 벨벳 파우치나 선물 박스 포장을 선택할 수 있으며, 리본 포장도 함께 제공됩니다.'
  },
  {
    question: '대량 주문 시 할인 혜택이 있나요?',
    answer: '30개 이상 주문 시 10% 할인, 100개 이상 주문 시 15% 할인 혜택을 제공합니다. 기업 기념품이나 단체 선물용으로 인기가 높습니다.'
  }
];

export default function FramePropNameTagPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={framePropNameTagProducts}
      faq={framePropNameTagFaq}
    />
  );
}