import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

export const metadata = {
  title: '액자 굿즈 제작 | 맞춤 포토프레임, 액자 제작 | PINTO',
  description: '고품질 소재로 제작하는 맞춤 액자. 우드, 아크릴, 메탈 프레임 등 다양한 소재와 사이즈로 소중한 추억을 보관하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/frame-goods'
  },
  openGraph: {
    title: '액자 굿즈 제작 | PINTO',
    description: '다양한 소재와 맞춤 사이즈로 제작하는 프리미엄 액자. 고급 마감으로 완성합니다.',
    url: 'https://pinto.co.kr/frame-goods',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '액자 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '액자 굿즈 제작 | PINTO',
    description: '소중한 추억을 담는 프리미엄 맞춤 액자를 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

const copy = {
  title: '액자 굿즈',
  subtitle: '맞춤 포토프레임과 액자 제품들을 확인해보세요',
  description: '고품질 소재로 제작하는 맞춤 액자. 우드, 아크릴, 메탈 프레임 등 다양한 소재와 사이즈로 소중한 추억을 보관하세요.'
};

// 액자 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getFrameProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [11, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['액자'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching frame products:', error);
    return [];
  }
}

export default async function FrameGoodsPage() {
  const products = await getFrameProducts();

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