import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

const copy = {
  title: 'LED 네온사인',
  subtitle: '밝고 화려한 LED 네온 조명',
  description: '카페, 매장, 이벤트 공간을 화려하게 장식하는 맞춤형 LED 네온사인을 제작하세요.',
  faq: [
    {
        "question": "LED 네온사인의 최소 주문 수량은 얼마인가요?",
        "answer": "LED 네온사인은 개별 제작으로 1개부터 주문 가능합니다."
    },
    {
        "question": "전력 소모량은 어떻게 되나요?",
        "answer": "기존 네온사인 대비 80% 이상 절약되며, 발열도 현저히 적습니다."
    },
    {
        "question": "실외 설치가 가능한가요?",
        "answer": "방수 처리된 제품으로 제작 시 실외 설치가 가능합니다."
    },
    {
        "question": "디머 기능이 있나요?",
        "answer": "밝기 조절 기능과 점멸 기능을 추가할 수 있습니다."
    }
],
  info: [
    "전국 무료배송 (10만원 이상 주문 시)",
    "제작 기간: 10-14 영업일",
    "A/S: 1년 품질보증"
]
};

const products = [
  {
    "id": 401,
    "name": "기본 LED 네온",
    "tags": [
      "기본",
      "단색"
    ],
    "price": 50000,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 402,
    "name": "RGB LED 네온",
    "tags": [
      "RGB",
      "컬러변환"
    ],
    "price": 80000,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 403,
    "name": "플렉시블 LED 네온",
    "tags": [
      "유연",
      "곡선"
    ],
    "price": 60000,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 404,
    "name": "아크릴 LED 네온",
    "tags": [
      "아크릴",
      "고급"
    ],
    "price": 120000,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 405,
    "name": "우드 LED 네온",
    "tags": [
      "원목",
      "내추럴"
    ],
    "price": 150000,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 406,
    "name": "미니 LED 네온",
    "tags": [
      "소형",
      "데스크탑"
    ],
    "price": 30000,
    "image": "/components/img/placeholder-product.jpg"
  }
];

export const metadata = {
  title: 'LED 네온사인 제작 | PINTO',
  description: '카페, 매장, 이벤트 공간을 화려하게 장식하는 맞춤형 LED 네온사인을 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/led-neon'
  },
  openGraph: {
    title: 'LED 네온사인 제작 | PINTO',
    description: '밝고 화려한 LED 네온 조명',
    url: 'https://pinto.co.kr/led-neon',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: 'LED 네온사인 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LED 네온사인 제작 | PINTO',
    description: '카페, 매장, 이벤트 공간을 화려하게 장식하는 맞춤형 LED 네온사인을 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

// LED 네온 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getLedNeonProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [10, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['LED 네온'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching LED neon products:', error);
    return [];
  }
}

export default async function LedNeonPage() {
  const products = await getLedNeonProducts();

  return (
    <CategoryPageTemplate
      title={copy.title}
      subtitle={copy.subtitle}
      description={copy.description}
      products={products}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}