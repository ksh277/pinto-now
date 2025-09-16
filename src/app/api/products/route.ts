import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getAllAcrylicProducts } from '@/lib/pricing-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');

    // 아크릴 상품들 (pricing-data.ts에서)
    const acrylicProducts = getAllAcrylicProducts();

    // 데이터베이스 상품들 (아크릴 상품 1-9 제외)
    let dbProducts: any[] = [];
    try {
      let sql = `
        SELECT
          p.id,
          p.name,
          p.description,
          p.thumbnail_url as imageUrl,
          p.category_id as categoryId,
          p.price,
          p.stock,
          p.status,
          p.created_at as createdAt,
          p.updated_at as updatedAt
        FROM products p
        WHERE p.status = 'ACTIVE'
        AND p.id NOT IN ('1', '2', '3', '4', '5', '6', '7', '8', '9')
        AND p.id >= 33
      `;

      const params: any[] = [];

      if (categoryId) {
        sql += ` AND p.category_id = ?`;
        params.push(categoryId);
      } else if (category) {
        // For backward compatibility with category names
        const categoryMapping: Record<string, string> = {
          '아크릴': '1',
          '의류': '2',
          '스티커': '3',
        };
        const mappedCategoryId = categoryMapping[category];
        if (mappedCategoryId) {
          sql += ` AND p.category_id = ?`;
          params.push(mappedCategoryId);
        }
      }

      sql += ` ORDER BY p.name ASC`;

      const results = await query(sql, params) as any[];

      dbProducts = results.map((row) => ({
        id: row.id.toString(),
        nameKo: row.name,
        nameEn: row.name,
        descriptionKo: row.description || '',
        descriptionEn: row.description || '',
        imageUrl: row.imageUrl,
        categoryId: row.categoryId.toString(),
        categoryKo: getCategoryName(row.categoryId.toString()),
        categoryEn: getCategoryName(row.categoryId.toString()),
        subcategory: '',
        isPublished: true,
        isFeatured: false,
        status: row.status,
        stockQuantity: row.stock,
        pricingData: null,
        priceKrw: row.price,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      }));
    } catch (dbError) {
      console.error('Database query failed, using only acrylic products:', dbError);
    }

    // 아크릴 상품과 데이터베이스 상품 합치기
    const allProducts = [...acrylicProducts, ...dbProducts];

    // 카테고리 필터링
    let filteredProducts = allProducts;
    if (categoryId) {
      filteredProducts = allProducts.filter(p => p.categoryId === categoryId);
    } else if (category) {
      const categoryMapping: Record<string, string> = {
        '아크릴': '1',
        '의류': '2',
        '스티커': '3',
      };
      const mappedCategoryId = categoryMapping[category];
      if (mappedCategoryId) {
        filteredProducts = allProducts.filter(p => p.categoryId === mappedCategoryId);
      }
    }

    return NextResponse.json({ products: filteredProducts }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// 카테고리 ID로 한국어 이름 반환
function getCategoryName(categoryId: string): string {
  const categoryNames: Record<string, string> = {
    '1': '아크릴 굿즈',
    '2': '의류',
    '3': '스티커(다꾸)',
    '4': '문구/오피스',
    '10': '커스텀상품(제품뷰)',
    '11': '단체판촉상품(제품뷰)',
    '12': 'IP굿즈 상품개발(페이지)',
    '13': '브랜드의뢰(페이지)',
    '14': '리뷰(게시판)',
    '15': '상품주문 가이드(페이지)',
    '16': '팬굿즈',
    '17': '지류 굿즈',
    '18': '핀거믹/버튼',
    '19': '등신대',
    '20': 'ETC',
    '21': '단체 판촉상품',
    '22': '머그컵/유리컵',
    '23': '텀블러',
    '24': '수건',
    '25': '시계',
    '26': '우산',
    '27': '광고물/사인',
    '28': 'LED 네온',
    '29': '환경디자인',
    '30': '미니간판',
    '31': '반려동물',
    '32': '액자/소품/네임택',
    '33': '쿠션/방석/패브릭 제품',
    '34': '장례용품',
    '35': '포장 부자재'
  };
  return categoryNames[categoryId] || '기타';
}

export async function POST(request: Request) {
  try {
    const {
      nameKo,
      nameEn,
      descriptionKo,
      descriptionEn,
      imageUrl,
      categoryId,
      subcategory,
      isPublished,
      isFeatured,
      status,
      stockQuantity,
      printTypes,
      sizes,
      pricingTiers,
      customOptions
    } = await request.json();

    // 최소 가격 계산 (가격 표시용)
    let minPrice = 0;

    // 사이즈별 가격이 있으면 가장 저렴한 가격을 사용
    if (sizes && sizes.length > 0) {
      const sizePrices = sizes.map((size: any) => {
        return size.basePrice || size.singlePrice || 0;
      }).filter((price: number) => price > 0);

      if (sizePrices.length > 0) {
        minPrice = Math.min(...sizePrices);
      }
    }

    // 사이즈별 가격이 없으면 pricing tiers에서 가격 찾기
    if (minPrice === 0 && pricingTiers && pricingTiers.length > 0) {
      const firstTier = pricingTiers[0];
      if (firstTier.prices) {
        const prices = Object.values(firstTier.prices) as number[];
        minPrice = Math.min(...prices.filter(p => p > 0));
      }
    }

    // 기본 seller_id를 1로 설정 (관리자 계정)
    const sellerId = 1;

    // 카테고리 매핑 (문자열 카테고리명을 ID로 변환)
    const categoryMapping: Record<string, number> = {
      'all': 1,
      'custom-product-view': 10,
      'promo-product-view': 11,
      'ip-goods-dev': 12,
      'brand-request': 13,
      'review': 14,
      'order-guide': 15,
      'fan-goods': 16,
      'akril-goods': 1,
      'paper-goods': 17,
      'sticker-goods': 3,
      'pin-button': 18,
      'life-size-standee': 19,
      'etc': 20,
      'promo': 21,
      'mug-glass': 22,
      'tumbler': 23,
      'towel': 24,
      'clock': 25,
      'umbrella': 26,
      'clothing-goods': 2,
      'signage': 27,
      'led-neon': 28,
      'env-design': 29,
      'mini-sign': 30,
      'pet': 31,
      'frame-prop-name-tag': 32,
      'cushion-fabric': 33,
      'funeral': 34,
      'packing-supplies': 35,
      'stationery-goods': 4,
      // 기존 호환성
      'acrylic': 1,
      'clothing': 2,
      'sticker': 3,
    };

    const categoryIdValue = categoryMapping[categoryId] || parseInt(categoryId) || 1;

    // slug 생성 (간단한 방식)
    const slug = nameKo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    const sql = `
      INSERT INTO products (
        seller_id,
        category_id,
        name,
        slug,
        description,
        price,
        stock,
        status,
        thumbnail_url,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await query(sql, [
      sellerId,
      categoryIdValue,
      nameKo,
      `${slug}-${Date.now()}`, // 고유한 slug 보장
      descriptionKo || '',
      minPrice || 10000, // 기본 가격
      stockQuantity || 100,
      status === 'active' ? 'ACTIVE' : 'DRAFT',
      imageUrl
    ]);

    // 별도 테이블에 복잡한 가격 정보 저장 (향후 확장용)
    const productId = (result as any).insertId;

    // pricing_data를 별도로 저장하거나 로그로 기록
    console.log('Product created with pricing data:', {
      productId,
      printTypes,
      sizes,
      pricingTiers,
      customOptions
    });

    return NextResponse.json({
      success: true,
      id: productId,
      message: '상품이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}