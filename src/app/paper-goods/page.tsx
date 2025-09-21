import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

const copy = {
  title: '지류 굿즈',
  subtitle: '다양한 종이 제품으로 브랜딩하세요',
  description: '명함, 포스터, 스티커, 카탈로그 등 고품질 인쇄물을 맞춤 제작합니다.',
};

const products = [
  { id: 801, name: '명함', image: '/components/img/placeholder-product.jpg', tags: ['명함', '비즈니스'], price: 20000 },
  { id: 802, name: '포스터', image: '/components/img/placeholder-product.jpg', tags: ['포스터', '대형인쇄'], price: 5000 },
  { id: 803, name: '전단지', image: '/components/img/placeholder-product.jpg', tags: ['전단지', '홍보'], price: 500 },
  { id: 804, name: '카탈로그', image: '/components/img/placeholder-product.jpg', tags: ['카탈로그', '제품소개'], price: 8000 },
  { id: 805, name: '브로셔', image: '/components/img/placeholder-product.jpg', tags: ['브로셔', '접지'], price: 3000 },
  { id: 806, name: '봉투', image: '/components/img/placeholder-product.jpg', tags: ['봉투', '우편'], price: 1000 },
  { id: 807, name: '노트', image: '/components/img/placeholder-product.jpg', tags: ['노트', '문구'], price: 12000 },
  { id: 808, name: '달력', image: '/components/img/placeholder-product.jpg', tags: ['달력', '연간'], price: 15000 }
];

export const metadata = {
  title: '지류 굿즈 제작 | 명함, 포스터, 카탈로그 인쇄 | PINTO',
  description: '고품질 인쇄물 제작 서비스. 명함, 포스터, 스티커, 카탈로그 등 다양한 종이 제품을 합리적인 가격에 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/paper-goods'
  }
};

// 지류 굿즈 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getPaperProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [12, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['지류'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching paper products:', error);
    return [];
  }
}

export default async function PaperGoodsPage() {
  const products = await getPaperProducts();

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