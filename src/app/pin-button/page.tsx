import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

const copy = {
  title: '핀버튼 굿즈',
  subtitle: '개성을 표현하는 작은 액세서리',
  description: '옷이나 가방에 포인트를 주는 핀버튼을 다양한 사이즈와 디자인으로 제작하세요.',
  faq: [
    {
        "question": "핀버튼의 최소 주문 수량은 얼마인가요?",
        "answer": "핀버튼은 최소 30개부터 주문 가능합니다. 수량이 많을수록 단가가 저렴해집니다."
    },
    {
        "question": "어떤 사이즈를 제작할 수 있나요?",
        "answer": "25mm, 32mm, 38mm, 44mm, 56mm 등 다양한 사이즈로 제작 가능합니다."
    },
    {
        "question": "제작 기간은 얼마나 걸리나요?",
        "answer": "디자인 확정 후 5-7 영업일이 소요됩니다. 급한 주문의 경우 추가 비용으로 단축 제작 가능합니다."
    },
    {
        "question": "핀의 종류는 어떤 것들이 있나요?",
        "answer": "일반 안전핀, 나비핀, 자석형 등 다양한 종류의 핀을 선택할 수 있습니다."
    }
],
  info: [
    "전국 무료배송 (3만원 이상 주문 시)",
    "제작 기간: 5-7 영업일",
    "대량 주문 할인: 300개 이상 25% 할인"
]
};

const products = [
  {
    "id": 201,
    "name": "25mm 핀버튼",
    "tags": [
      "소형",
      "25mm"
    ],
    "price": 800,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 202,
    "name": "32mm 핀버튼",
    "tags": [
      "기본",
      "32mm"
    ],
    "price": 900,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 203,
    "name": "38mm 핀버튼",
    "tags": [
      "중형",
      "38mm"
    ],
    "price": 1000,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 204,
    "name": "44mm 핀버튼",
    "tags": [
      "대형",
      "44mm"
    ],
    "price": 1200,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 205,
    "name": "56mm 핀버튼",
    "tags": [
      "특대형",
      "56mm"
    ],
    "price": 1500,
    "image": "/components/img/placeholder-product.jpg"
  },
  {
    "id": 206,
    "name": "자석형 핀버튼",
    "tags": [
      "자석",
      "옷감보호"
    ],
    "price": 1300,
    "image": "/components/img/placeholder-product.jpg"
  }
];

export const metadata = {
  title: '핀버튼 굿즈 제작 | PINTO',
  description: '옷이나 가방에 포인트를 주는 핀버튼을 다양한 사이즈와 디자인으로 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/pin-button'
  },
  openGraph: {
    title: '핀버튼 굿즈 제작 | PINTO',
    description: '개성을 표현하는 작은 액세서리',
    url: 'https://pinto.co.kr/pin-button',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '핀버튼 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '핀버튼 굿즈 제작 | PINTO',
    description: '옷이나 가방에 포인트를 주는 핀버튼을 다양한 사이즈와 디자인으로 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

// 핀버튼 카테고리 상품 데이터를 데이터베이스에서 직접 가져오는 함수
async function getPinButtonProducts() {
  try {
    const products = await query(`
      SELECT
        id,
        name,
        thumbnail_url as image,
        price
      FROM products
      WHERE category_id = 8 AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `) as any[];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['핀버튼', '버튼'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching pin button products:', error);
    return []; // 에러 시 빈 배열 반환
  }
}

export default async function PinButtonPage() {
  const pinButtonProducts = await getPinButtonProducts();

  return (
    <CategoryPageTemplate
      title={copy.title}
      subtitle={copy.subtitle}
      description={copy.description}
      products={pinButtonProducts}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}