import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // 추가 카테고리들 생성
    const categories = await Promise.all([
      prisma.categories.upsert({
        where: { slug: 'sticker' },
        update: {},
        create: {
          name: '스티커',
          slug: 'sticker',
          description: '다양한 스티커 제품',
          sort_order: 6,
          is_active: true
        }
      }),
      prisma.categories.upsert({
        where: { slug: 'clothing' },
        update: {},
        create: {
          name: '의류',
          slug: 'clothing',
          description: '티셔츠, 후드 등 의류 제품',
          sort_order: 7,
          is_active: true
        }
      }),
      prisma.categories.upsert({
        where: { slug: 'frame' },
        update: {},
        create: {
          name: '액자',
          slug: 'frame',
          description: '포토프레임과 액자 제품',
          sort_order: 8,
          is_active: true
        }
      }),
      prisma.categories.upsert({
        where: { slug: 'office' },
        update: {},
        create: {
          name: '문구/오피스',
          slug: 'office',
          description: '문구용품과 오피스 용품',
          sort_order: 9,
          is_active: true
        }
      })
    ]);

    // 기본 판매자 찾기
    const seller = await prisma.user.findFirst({
      where: { username: 'default_seller' }
    });

    if (!seller) {
      throw new Error('Default seller not found');
    }

    // 각 카테고리별 추가 상품 데이터
    const stickerProducts = [
      { name: '홀로그램 스티커', price: 8000, description: '반짝이는 홀로그램 효과가 있는 스티커' },
      { name: '비닐 스티커', price: 5000, description: '내구성이 좋은 방수 비닐 스티커' },
      { name: '투명 스티커', price: 6000, description: '투명한 배경의 깔끔한 스티커' },
      { name: '커스텀 스티커', price: 10000, description: '원하는 디자인으로 제작하는 맞춤 스티커' },
      { name: '원형 스티커', price: 4000, description: '동그란 원형 모양의 스티커' },
    ];

    const clothingProducts = [
      { name: '면 티셔츠 (기본)', price: 18000, description: '100% 순면 소재의 기본 티셔츠' },
      { name: '후드 집업', price: 35000, description: '따뜻한 후드 집업 (지퍼형)' },
      { name: '맨투맨', price: 25000, description: '편안한 착용감의 맨투맨' },
      { name: '반팔 폴로셔츠', price: 22000, description: '깔끔한 반팔 폴로셔츠' },
      { name: '롱슬리브 티셔츠', price: 20000, description: '긴팔 티셔츠' },
    ];

    const frameProducts = [
      { name: 'A4 아크릴 액자', price: 15000, description: 'A4 크기의 투명 아크릴 액자' },
      { name: '포토 프레임 (4x6)', price: 8000, description: '사진용 작은 프레임' },
      { name: '우드 액자 (A3)', price: 25000, description: '원목 소재의 A3 액자' },
      { name: '자석 액자', price: 12000, description: '자석으로 부착하는 간편한 액자' },
      { name: '스탠딩 프레임', price: 18000, description: '책상 위에 세워두는 스탠딩 프레임' },
    ];

    const officeProducts = [
      { name: '볼펜 (커스텀)', price: 3000, description: '로고나 텍스트를 넣은 맞춤 볼펜' },
      { name: '노트북 (무선)', price: 8000, description: '무선 제본된 노트북' },
      { name: '메모패드', price: 5000, description: '편리한 사용을 위한 메모패드' },
      { name: '마우스패드', price: 12000, description: '디자인 프린팅된 마우스패드' },
      { name: '파일 클립', price: 2000, description: '서류 정리용 파일 클립' },
      { name: '데스크 캘린더', price: 15000, description: '책상용 탁상 캘린더' },
    ];

    // 상품 데이터 생성
    const allProducts = [
      ...stickerProducts.map(p => ({ ...p, categoryId: categories[0].id })),
      ...clothingProducts.map(p => ({ ...p, categoryId: categories[1].id })),
      ...frameProducts.map(p => ({ ...p, categoryId: categories[2].id })),
      ...officeProducts.map(p => ({ ...p, categoryId: categories[3].id })),
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
          stock: Math.floor(Math.random() * 100) + 10,
          status: 'ACTIVE',
          is_customizable: Math.random() > 0.6, // 40% 확률로 커스터마이징 가능
          thumbnail_url: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`,
          rating_avg: Math.round((Math.random() * 2 + 3) * 10) / 10,
          review_count: Math.floor(Math.random() * 50),
          view_count: Math.floor(Math.random() * 500)
        }
      });
      createdProducts.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `${categories.length}개 추가 카테고리와 ${createdProducts.length}개 상품이 생성되었습니다.`,
      categories: categories.length,
      products: createdProducts.length
    });

  } catch (error) {
    console.error('추가 상품 데이터 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '추가 상품 데이터 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';