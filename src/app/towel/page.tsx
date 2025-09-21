import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

const copy = {
  title: '수건/타올 굿즈',
  subtitle: '일상에서 사용하는 실용적인 수건',
  description: '로고나 디자인이 들어간 맞춤형 수건을 다양한 사이즈와 소재로 제작하세요.',
};

// 수건/타올 카테고리 상품을 데이터베이스에서 가져오는 함수
async function getTowelProducts() {
  try {
    const products = await query(
      'SELECT id, name, thumbnail_url as image, price FROM products WHERE category_id = ? AND status = ? ORDER BY created_at DESC',
      [7, 'ACTIVE']
    );

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.image || '/components/img/placeholder-product.jpg',
      tags: ['수건'],
      price: parseInt(product.price)
    }));
  } catch (error) {
    console.error('Error fetching towel products:', error);
    // 데이터베이스 조회 실패 시 빈 배열 반환
    return [];
  }
}

export const metadata = {
  title: '수건/타올 굿즈 제작 | PINTO',
  description: '로고나 디자인이 들어간 맞춤형 수건을 다양한 사이즈와 소재로 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/towel'
  },
  openGraph: {
    title: '수건/타올 굿즈 제작 | PINTO',
    description: '일상에서 사용하는 실용적인 수건',
    url: 'https://pinto.co.kr/towel',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '수건/타올 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '수건/타올 굿즈 제작 | PINTO',
    description: '로고나 디자인이 들어간 맞춤형 수건을 다양한 사이즈와 소재로 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default async function TowelPage() {
  const products = await getTowelProducts();

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