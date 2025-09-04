import { getCategoryMapping } from '@/lib/category-mappings';
import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { Metadata } from 'next';

const categorySlug = 'pet';
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

// 반려동물 카테고리 전용 샘플 제품들
const petProducts = [
  { id: 'pet-id-tag-bone', name: '반려견 인식표 (뼈모양)', tags: ['인식표', '뼈모양', '안전'], price: 12000, image: '/images/pet/id-tag-bone.png' },
  { id: 'pet-food-bowl-custom', name: '맞춤 사료그릇', tags: ['사료그릇', '스테인리스', '개인화'], price: 25000, image: '/images/pet/food-bowl.png' },
  { id: 'pet-leash-custom', name: '맞춤 목줄', tags: ['목줄', '안전', '편안'], price: 18000, image: '/images/pet/leash.png' },
  { id: 'pet-blanket-photo', name: '반려동물 담요 (사진)', tags: ['담요', '사진', '따뜻함'], price: 35000, image: '/images/pet/blanket-photo.png' },
  { id: 'pet-memorial-frame', name: '반려동물 메모리얼 액자', tags: ['메모리얼', '액자', '추억'], price: 30000, image: '/images/pet/memorial-frame.png' },
  { id: 'pet-toy-custom', name: '맞춤 장난감', tags: ['장난감', '안전소재', '재미'], price: 20000, image: '/images/pet/toy-custom.png' }
];

// 반려동물 카테고리 전용 FAQ
const petFaq = [
  {
    question: '반려동물용 제품은 안전한 소재를 사용하나요?',
    answer: '네, 모든 반려동물용 제품은 펫 전용 안전 소재를 사용합니다. 무독성, 친환경 소재로 제작되며, 반려동물이 핥거나 물어도 안전합니다.'
  },
  {
    question: '인식표에 어떤 정보를 새길 수 있나요?',
    answer: '반려동물 이름, 보호자 연락처, 주소 등을 새길 수 있습니다. 글자수 제한이 있으니 꼭 필요한 정보만 간단히 새기시기를 권장합니다.'
  },
  {
    question: '반려동물 사진으로 제작할 때 어떤 사진이 좋나요?',
    answer: '밝고 선명한 사진이 좋습니다. 배경이 단순하고 반려동물이 정면을 바라보는 사진이 가장 좋은 결과를 만들어냅니다. 고해상도 사진을 제출해주세요.'
  },
  {
    question: '반려동물 크기에 맞는 제품 선택은 어떻게 하나요?',
    answer: '견종별, 크기별 가이드를 제공합니다. 목둘레, 몸무게 등을 측정하여 알려주시면 최적의 사이즈를 추천해드립니다.'
  }
];

export default function PetPage() {
  return (
    <CategoryPageTemplate 
      mapping={mapping}
      products={petProducts}
      faq={petFaq}
    />
  );
}