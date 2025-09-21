import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

export const metadata = {
  title: '의류 굿즈 제작 | 맞춤 티셔츠, 후드티 제작 | PINTO',
  description: '고품질 원단과 정밀 프린팅으로 제작하는 맞춤 의류. 티셔츠, 후드티, 맨투맨 등 다양한 의류를 합리적인 가격에 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/clothing-goods'
  },
  openGraph: {
    title: '의류 굿즈 제작 | PINTO',
    description: '프리미엄 원단과 다양한 프린팅 방식으로 제작하는 개성 있는 맞춤 의류. 풀사이즈 제공.',
    url: 'https://pinto.co.kr/clothing-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '의류 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '의류 굿즈 제작 | PINTO',
    description: '편안하고 스타일리시한 맞춤 의류를 합리적인 가격에 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

const copy = {
  title: '의류 굿즈',
  subtitle: '맞춤 티셔츠, 후드티 등 다양한 의류 제품들을 확인해보세요',
  description: '고품질 원단과 정밀 프린팅으로 제작하는 맞춤 의류. 티셔츠, 후드티, 맨투맨 등 다양한 의류를 합리적인 가격에 제작하세요.'
};

// 의류 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getClothingProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [8, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['의류'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching clothing products:', error);
    return [];
  }
}

export default async function ClothingGoodsPage() {
  const products = await getClothingProducts();

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