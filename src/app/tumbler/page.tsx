import CategoryPageTemplate from '@/components/shared/CategoryPageTemplate';
import { query } from '@/lib/mysql';

export const metadata = {
  title: '텀블러 굿즈 제작 | PINTO',
  description: '보온/보냉 기능이 뛰어난 맞춤형 텀블러를 로고나 디자인과 함께 제작하세요.',
  alternates: {
    canonical: 'https://pinto.co.kr/tumbler'
  },
  openGraph: {
    title: '텀블러 굿즈 제작 | PINTO',
    description: '친환경적이고 실용적인 텀블러',
    url: 'https://pinto.co.kr/tumbler',
    siteName: 'PINTO',
    type: 'website',
    images: [
      {
        url: '/components/img/placeholder-product.jpg',
        width: 1200,
        height: 630,
        alt: '텀블러 굿즈 제작'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '텀블러 굿즈 제작 | PINTO',
    description: '보온/보냉 기능이 뛰어난 맞춤형 텀블러를 로고나 디자인과 함께 제작하세요.',
    images: ['/components/img/placeholder-product.jpg']
  }
};

export default async function TumblerPage() {
  // 카테고리 2 (텀블러) 상품들을 데이터베이스에서 조회
  const products = await query(`
    SELECT
      id,
      name,
      thumbnail_url as image,
      price,
      '' as tags
    FROM products
    WHERE category_id = 2 AND status = 'ACTIVE'
    ORDER BY created_at DESC
  `) as any[];

  // 상품 데이터를 CategoryPageTemplate 형식에 맞게 변환
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    image: product.image || '/components/img/placeholder-product.jpg',
    tags: ['텀블러'], // 기본 태그
    price: parseInt(product.price)
  }));

  return (
    <CategoryPageTemplate
      title="텀블러 굿즈"
      subtitle="친환경적이고 실용적인 텀블러"
      description="보온/보냉 기능이 뛰어난 맞춤형 텀블러를 로고나 디자인과 함께 제작하세요."
      products={formattedProducts}
      showFaq={false}
      showInfo={false}
      showCta={false}
    />
  );
}