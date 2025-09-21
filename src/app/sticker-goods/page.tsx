import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

const products = [
  { id: 101, name: '투명 스티커', image: '/components/img/placeholder-product.jpg', tags: ['투명', '내구성'], price: 2000 },
  { id: 102, name: '홀로그램 스티커', image: '/components/img/placeholder-product.jpg', tags: ['홀로그램', '특수'], price: 3500 },
  { id: 103, name: '커팅 스티커', image: '/components/img/placeholder-product.jpg', tags: ['커팅', '맞춤'], price: 1800 },
  { id: 104, name: '라벨 스티커', image: '/components/img/placeholder-product.jpg', tags: ['라벨', '인쇄'], price: 1500 },
  { id: 105, name: '마그네틱 스티커', image: '/components/img/placeholder-product.jpg', tags: ['자석', '재부착'], price: 4000 },
  { id: 106, name: '형광 스티커', image: '/components/img/placeholder-product.jpg', tags: ['형광', '야광'], price: 2800 },
  { id: 107, name: '메탈릭 스티커', image: '/components/img/placeholder-product.jpg', tags: ['메탈릭', '고급'], price: 3200 },
  { id: 108, name: '패브릭 스티커', image: '/components/img/placeholder-product.jpg', tags: ['패브릭', '질감'], price: 2500 }
];

const faq = [
  {
    question: '스티커의 내구성은 어느 정도인가요?',
    answer: '실외용 스티커는 3-5년, 실내용은 7-10년 정도 사용 가능합니다. 방수, 자외선 차단 기능이 있어 오래 사용할 수 있습니다.'
  },
  {
    question: '최소 주문 수량은 얼마인가요?',
    answer: '스티커는 최소 50개부터 주문 가능합니다. 소량 주문도 환영하며, 수량이 많을수록 단가가 저렴해집니다.'
  },
  {
    question: '어떤 재질에 붙일 수 있나요?',
    answer: '유리, 플라스틱, 금속, 종이 등 대부분의 평평한 표면에 부착 가능합니다. 표면 상태에 따라 접착력이 달라질 수 있습니다.'
  },
  {
    question: '커스텀 디자인이 가능한가요?',
    answer: '네, 고객님의 디자인으로 제작 가능합니다. AI, PSD, PDF 파일을 제공해주시면 정확한 색상으로 인쇄해드립니다.'
  }
];

const info = [
  '전국 무료배송 (3만원 이상 주문 시)',
  '제작 기간: 3-5 영업일',
  '소량 제작부터 대량 생산까지'
];

export const metadata = {
  title: '스티커(다꾸) 제작 | 투명, 홀로그램, 커팅 스티커 전문 | PINTO',
  description: '고품질 스티커 제작 서비스. 투명, 홀로그램, 커팅, 라벨 등 다양한 스티커를 합리적인 가격에 제작하세요. 다이어리 꾸미기부터 브랜딩까지.',
  alternates: {
    canonical: 'https://pinto.co.kr/sticker-goods'
  }
};

// 스티커 굿즈 카테고리 상품 데이터를 데이터베이스에서 직접 가져오는 함수
async function getStickerProducts() {
  try {
    const products = await query(`
      SELECT
        id,
        name,
        thumbnail_url as image,
        price
      FROM products
      WHERE category_id = 5 AND status = 'ACTIVE'
      ORDER BY created_at DESC
    `) as any[];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['스티커', '다꾸'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching sticker products:', error);
    return []; // 에러 시 빈 배열 반환
  }
}

export default async function StickerGoodsPage() {
  const stickerProducts = await getStickerProducts();

  return (
    <CategoryPageTemplate
      title="스티커(다꾸)"
      subtitle="다양한 스티커로 나만의 스타일을 표현하세요"
      description="투명, 홀로그램, 커팅 등 고품질 스티커 제작"
      products={stickerProducts}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}
