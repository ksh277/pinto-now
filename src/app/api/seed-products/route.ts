import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // 먼저 기본 카테고리들을 생성
    const categories = await Promise.all([
      prisma.categories.upsert({
        where: { slug: 'acrylic' },
        update: {},
        create: {
          name: '아크릴굿즈',
          slug: 'acrylic',
          description: '투명하고 견고한 프리미엄 아크릴 제품',
          sort_order: 1,
          is_active: true
        }
      }),
      prisma.categories.upsert({
        where: { slug: 'wood' },
        update: {},
        create: {
          name: '우드굿즈',
          slug: 'wood', 
          description: '따뜻하고 자연스러운 우드 소재 제품',
          sort_order: 2,
          is_active: true
        }
      }),
      prisma.categories.upsert({
        where: { slug: 'lanyard' },
        update: {},
        create: {
          name: '랜야드',
          slug: 'lanyard',
          description: '목걸이형 스트랩과 키링 제품',
          sort_order: 3,
          is_active: true
        }
      }),
      prisma.categories.upsert({
        where: { slug: 'packaging' },
        update: {},
        create: {
          name: '포장/부자재',
          slug: 'packaging',
          description: '스와치, 부자재, 포장재',
          sort_order: 4,
          is_active: true
        }
      }),
      prisma.categories.upsert({
        where: { slug: 'paper-goods' },
        update: {},
        create: {
          name: '지류 굿즈',
          slug: 'paper-goods',
          description: '포스터, 스티커, 엽서 등 종이 제품',
          sort_order: 5,
          is_active: true
        }
      })
    ]);

    // 기본 판매자 생성 (존재하지 않는 경우)
    const seller = await prisma.user.upsert({
      where: { username: 'default_seller' },
      update: {},
      create: {
        username: 'default_seller',
        email: 'seller@pinto.com',
        password_hash: 'temp_password',
        status: 'ACTIVE'
      }
    });

    // 각 카테고리별 임시 상품 데이터
    const acrylicProducts = [
      { name: '투명 아크릴 키링', price: 15000, description: '고품질 아크릴로 제작된 투명 키링' },
      { name: '아크릴 스마트톡', price: 12000, description: 'UV 프린팅으로 선명한 이미지 구현' },
      { name: '아크릴 스탠드', price: 25000, description: '견고하고 안정적인 아크릴 스탠드' },
      { name: '아크릴 거울', price: 18000, description: '긁힘 방지 코팅 처리된 아크릴 거울' },
      { name: '아크릴 쉐이커', price: 22000, description: '움직이는 액세서리가 들어간 쉐이커' },
    ];

    const woodProducts = [
      { name: '원목 키링', price: 8000, description: '자연스러운 나뭇결이 살아있는 우드 키링' },
      { name: '우드 마그넷', price: 6000, description: '강력한 자석이 내장된 우드 마그넷' },
      { name: '우드 스탠드', price: 20000, description: '따뜻한 감성의 원목 스탠드' },
    ];

    const lanyardProducts = [
      { name: '목걸이 랜야드 (기본)', price: 5000, description: '심플하고 실용적인 목걸이 랜야드' },
      { name: '목걸이 랜야드 (프리미엄)', price: 8000, description: '고급스러운 소재의 프리미엄 랜야드' },
      { name: '리얼 키링', price: 4000, description: '열쇠고리용 미니 랜야드' },
    ];

    const packagingProducts = [
      { name: '컬러 스와치', price: 3000, description: '다양한 색상의 컬러 견본' },
      { name: '투명 OPP봉투', price: 1500, description: '상품 포장용 투명 봉투' },
      { name: '크라프트 박스', price: 2000, description: '친환경 크라프트 포장 박스' },
    ];

    const paperProducts = [
      { name: 'A3 포스터', price: 8000, description: '고품질 용지에 인쇄된 A3 포스터' },
      { name: '홀로그램 스티커', price: 5000, description: '반짝이는 홀로그램 효과 스티커' },
      { name: '엽서 세트 (10장)', price: 12000, description: '고급 용지 엽서 10장 세트' },
      { name: '명함 (100장)', price: 15000, description: '비즈니스용 고급 명함' },
    ];

    // 상품 데이터 생성
    const allProducts = [
      ...acrylicProducts.map(p => ({ ...p, categoryId: categories[0].id })),
      ...woodProducts.map(p => ({ ...p, categoryId: categories[1].id })),
      ...lanyardProducts.map(p => ({ ...p, categoryId: categories[2].id })),
      ...packagingProducts.map(p => ({ ...p, categoryId: categories[3].id })),
      ...paperProducts.map(p => ({ ...p, categoryId: categories[4].id })),
    ];

    const createdProducts = [];
    for (const product of allProducts) {
      const created = await prisma.products.create({
        data: {
          seller_id: seller.id,
          category_id: product.categoryId,
          name: product.name,
          slug: product.name.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-'),
          description: product.description,
          price: product.price,
          stock: Math.floor(Math.random() * 100) + 10, // 10-110 사이 랜덤 재고
          status: 'ACTIVE',
          is_customizable: Math.random() > 0.7, // 30% 확률로 커스터마이징 가능
          thumbnail_url: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
          rating_avg: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 사이 평점
          review_count: Math.floor(Math.random() * 50),
          view_count: Math.floor(Math.random() * 500)
        }
      });
      createdProducts.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `${categories.length}개 카테고리와 ${createdProducts.length}개 상품이 생성되었습니다.`,
      categories: categories.length,
      products: createdProducts.length
    });

  } catch (error) {
    console.error('상품 데이터 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '상품 데이터 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';