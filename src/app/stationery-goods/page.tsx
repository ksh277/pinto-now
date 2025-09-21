import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

const copy = {
  title: '문구/오피스 굿즈',
  subtitle: '업무와 학습을 위한 실용적인 맞춤 문구',
  description: '일상에서 유용하게 사용할 수 있는 고품질 문구 및 오피스 용품을 맞춤 제작합니다.',
};

// 문구/오피스 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getStationeryProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [9, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['문구'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching stationery products:', error);
    return [];
  }
}

export const metadata = {
  title: '문구/오피스 굿즈 제작 | 맞춤 노트, 펜, 마우스패드 | PINTO',
  description: '업무와 학습을 위한 실용적인 맞춤 문구 제작. 노트, 펜, 마우스패드, 파일 등 다양한 문구용품을 고품질로 제작합니다.',
  alternates: {
    canonical: 'https://pinto.co.kr/stationery-goods'
  },
  openGraph: {
    title: '문구/오피스 굿즈 제작 | PINTO',
    description: '실용적이고 개성 있는 맞춤 문구 제품. 일상에서 유용하게 사용할 수 있는 고품질 문구용품을 제작하세요.',
    url: 'https://pinto.co.kr/stationery-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '문구/오피스 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '문구/오피스 굿즈 제작 | PINTO',
    description: '업무 효율을 높이는 맞춤 문구 제품을 합리적인 가격에 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default async function StationeryGoodsPage() {
  const products = await getStationeryProducts();

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