import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인 (개발 중 임시 우회)
    // const authUser = await verifyRequestAuth(request);
    // if (!authUser || authUser.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    // URL 파라미터 파싱
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const offset = (page - 1) * limit;

    // WHERE 조건 구성
    let whereConditions = ["p.status != 'DELETED'"];
    let queryParams: any[] = [];

    if (category && category !== 'all') {
      whereConditions.push('p.category_id = ?');
      queryParams.push(category);
    }

    if (status && status !== 'all') {
      whereConditions.push('p.status = ?');
      queryParams.push(status);
    }

    if (search) {
      whereConditions.push('(p.name_ko LIKE ? OR p.name_en LIKE ? OR p.id LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause = whereConditions.join(' AND ');

    // 상품 목록 조회 (실제 DB 구조에 맞게) - UTF8 인코딩 명시
    const products = await query(`
      SELECT
        p.id,
        CONVERT(p.name USING utf8mb4) as nameKo,
        CONVERT(p.name USING utf8mb4) as nameEn,
        p.thumbnail_url as imageUrl,
        p.category_id as categoryId,
        p.price as priceKrw,
        p.stock as stockQuantity,
        p.status,
        p.created_at as createdAt,
        p.updated_at as updatedAt
      FROM products p
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]) as any[];

    // 총 개수 조회
    const [{ total }] = await query(`
      SELECT COUNT(*) as total
      FROM products p
      WHERE ${whereClause}
    `, queryParams) as any[];

    // 상품 데이터 반환 (추가 처리 없이)
    const enhancedProducts = products.map(product => ({
      ...product,
      // 카테고리 이름 매핑
      categoryKo: getCategoryKoName(product.categoryId),
      category_name: getCategoryKoName(product.categoryId)
    }));

    function getCategoryKoName(categoryId: string | number): string {
      const categoryMap: Record<string, string> = {
        '1': '아크릴 굿즈',
        '2': '텀블러',
        '3': '마그컵/유리컵',
        '4': '의류 굿즈',
        '5': '스티커 굿즈',
        '6': '문구 굿즈',
        '7': '인형/쿠션',
        '8': '액자/액자굿즈',
        '9': '팬굿즈',
        '10': '기타'
      };
      return categoryMap[String(categoryId)] || '기타';
    }

    return NextResponse.json({
      products: enhancedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인 (개발 중 임시 우회)
    // const authUser = await verifyRequestAuth(request);
    // if (!authUser || authUser.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const body = await request.json();

    const {
      nameKo,
      nameEn,
      descriptionKo,
      descriptionEn,
      imageUrl,
      categoryId,
      priceKrw,
      stockQuantity,
      status = 'DRAFT',
      isPublished = false,
      isFeatured = false,
      pricingData,
      descriptionImageUrl,
      additionalImages
    } = body;

    // 기본 상품 정보 삽입 (실제 DB 스키마에 맞게 수정)
    const slug = `${nameKo.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // pricing 데이터에서 최소 가격 계산
    let calculatedPrice = priceKrw;
    if (!calculatedPrice && pricingData?.pricingTiers?.length > 0) {
      const firstTier = pricingData.pricingTiers[0];
      if (firstTier.prices && Object.keys(firstTier.prices).length > 0) {
        const prices = Object.values(firstTier.prices).filter((p: any) => typeof p === 'number' && p > 0) as number[];
        if (prices.length > 0) {
          calculatedPrice = Math.min(...prices);
        }
      }
    }

    // 가격이 없으면 기본값 설정
    if (!calculatedPrice) {
      calculatedPrice = 10000; // 기본 가격
    }

    const result = await query(`
      INSERT INTO products (
        seller_id, category_id, name, slug, description,
        price, stock, status, thumbnail_url,
        is_customizable, description_detail
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      1, // 기본 seller_id
      parseInt(categoryId) || 1, nameKo, slug, descriptionKo || '',
      calculatedPrice || 10000, stockQuantity || 100, status, imageUrl,
      1, // is_customizable
      JSON.stringify({
        pricingData,
        descriptionImageUrl,
        additionalImages: additionalImages || []
      })
    ]) as any;

    const productId = result.insertId;

    // 상세 정보가 있으면 product_details에 삽입
    if (pricingData || descriptionImageUrl || additionalImages) {
      const detailData = {
        pricingData,
        descriptionImageUrl,
        additionalImages: additionalImages || [],
        lastUpdated: new Date().toISOString()
      };

      await query(`
        INSERT INTO product_details (product_id, detail_data)
        VALUES (?, ?)
      `, [productId, JSON.stringify(detailData)]);
    }

    return NextResponse.json({
      success: true,
      productId,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';