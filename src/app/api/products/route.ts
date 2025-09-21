import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getAllAcrylicProducts } from '@/lib/pricing-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
    const includeEnhanced = searchParams.get('includeEnhanced') === 'true';

    // 데이터베이스 상품들 조회 (향상된 세부 데이터 포함)
    let dbProducts: any[] = [];
    try {
      let sql = `
        SELECT
          p.id,
          CONVERT(p.name USING utf8mb4) as name_ko,
          CONVERT(p.name USING utf8mb4) as name_en,
          CONVERT(p.description USING utf8mb4) as description_ko,
          CONVERT(p.description USING utf8mb4) as description_en,
          p.thumbnail_url as imageUrl,
          p.category_id as categoryId,
          p.price,
          p.stock,
          p.status,
          p.created_at as createdAt,
          p.updated_at as updatedAt
        FROM products p
        WHERE p.status = 'ACTIVE'
      `;

      const params: any[] = [];

      if (categoryId) {
        sql += ` AND p.category_id = ?`;
        params.push(categoryId);
      } else if (category) {
        const categoryMapping: Record<string, string> = {
          '아크릴': '1',
          '의류': '2',
          '스티커': '3',
          'umbrella': '6',
          '우산': '6',
        };
        const mappedCategoryId = categoryMapping[category];
        if (mappedCategoryId) {
          sql += ` AND p.category_id = ?`;
          params.push(mappedCategoryId);
        }
      }

      sql += ` ORDER BY p.created_at DESC`;

      const results = await query(sql, params) as any[];

      dbProducts = results.map((row) => {
        let detailData = null;
        let descriptionImageUrl = null;
        let additionalImages: string[] = [];
        let pricingData = null;

        // product_details 데이터 파싱
        if (row.detail_data) {
          try {
            detailData = JSON.parse(row.detail_data);
            descriptionImageUrl = detailData.descriptionImageUrl;
            additionalImages = detailData.additionalImages || [];
            pricingData = detailData.pricingData;
          } catch (e) {
            console.error('Failed to parse detail_data for product', row.id, e);
          }
        }

        const baseProduct = {
          id: row.id.toString(),
          nameKo: row.name_ko || row.name_en || '',
          nameEn: row.name_en || row.name_ko || '',
          descriptionKo: row.description_ko || '',
          descriptionEn: row.description_en || '',
          imageUrl: row.imageUrl,
          categoryId: row.categoryId.toString(),
          categoryKo: getCategoryName(row.categoryId.toString()),
          categoryEn: getCategoryName(row.categoryId.toString()),
          subcategory: '',
          isPublished: row.isPublished === 1,
          isFeatured: row.isFeatured === 1,
          status: row.status,
          stockQuantity: row.stock,
          priceKrw: row.price,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt
        };

        // 향상된 데이터가 요청되거나 available한 경우 포함
        if (includeEnhanced || pricingData) {
          return {
            ...baseProduct,
            descriptionImageUrl,
            additionalImages,
            pricingData,
            hasEnhancedFeatures: !!pricingData
          };
        }

        return baseProduct;
      });
    } catch (dbError) {
      console.error('Database query failed:', dbError);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // 아크릴 상품들만 표시 (관리자용)
    if (categoryId === '1' || category === '아크릴') {
      const acrylicProducts = getAllAcrylicProducts();
      dbProducts = acrylicProducts; // DB 상품 대신 아크릴 상품만
    }

    // 카테고리 필터링
    let filteredProducts = dbProducts;
    if (categoryId) {
      filteredProducts = dbProducts.filter(p => p.categoryId === categoryId);
    } else if (category) {
      const categoryMapping: Record<string, string> = {
        '아크릴': '1',
        '의류': '2',
        '스티커': '3',
        'umbrella': '6',
        '우산': '6',
      };
      const mappedCategoryId = categoryMapping[category];
      if (mappedCategoryId) {
        filteredProducts = dbProducts.filter(p => p.categoryId === mappedCategoryId);
      }
    }

    return NextResponse.json({
      products: filteredProducts,
      totalCount: filteredProducts.length,
      hasEnhancedData: filteredProducts.some(p => p.hasEnhancedFeatures)
    }, {
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
    '6': '우산',
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
      customOptions,
      descriptionImageUrl,
      additionalImages,
      pricingData
    } = await request.json();

    // 최소 가격 계산 (가격 표시용)
    let minPrice = 0;

    // 향상된 가격 데이터에서 가격 추출
    if (pricingData && pricingData.pricingTiers && pricingData.pricingTiers.length > 0) {
      const firstTier = pricingData.pricingTiers[0];
      if (firstTier.prices) {
        const prices = Object.values(firstTier.prices) as number[];
        minPrice = Math.min(...prices.filter(p => p > 0));
      }
    }

    // 기존 방식으로도 가격 계산 (하위 호환성)
    if (minPrice === 0) {
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
    }

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
      'acrylic': 1,
      'clothing': 2,
      'sticker': 3,
    };

    const categoryIdValue = categoryMapping[categoryId] || parseInt(categoryId) || 1;

    // slug 생성 (간단한 방식)
    const slug = nameKo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    // 기본 상품 정보 삽입
    const sql = `
      INSERT INTO products (
        category_id,
        name,
        description,
        slug,
        price,
        stock,
        status,
        thumbnail_url,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await query(sql, [
      categoryIdValue,
      nameKo,
      descriptionKo || '',
      `${slug}-${Date.now()}`, // 고유한 slug 보장
      minPrice || 10000, // 기본 가격
      stockQuantity || 100,
      status === 'active' ? 'ACTIVE' : 'DRAFT',
      imageUrl
    ]);

    const productId = (result as any).insertId;

    // 향상된 상품 데이터가 있으면 product_details 테이블에 저장
    if (pricingData || descriptionImageUrl || (additionalImages && additionalImages.length > 0)) {
      const detailData = {
        pricingData: pricingData || null,
        descriptionImageUrl: descriptionImageUrl || null,
        additionalImages: additionalImages || [],
        printTypes: printTypes || null,
        sizes: sizes || null,
        pricingTiers: pricingTiers || null,
        customOptions: customOptions || null,
        lastUpdated: new Date().toISOString()
      };

      await query(`
        INSERT INTO product_details (product_id, detail_data)
        VALUES (?, ?)
      `, [productId, JSON.stringify(detailData)]);

      console.log('Enhanced product created with detailed data:', {
        productId,
        hasDetailData: true,
        hasPricingData: !!pricingData,
        hasImages: !!(descriptionImageUrl || additionalImages?.length)
      });
    } else {
      console.log('Basic product created:', {
        productId,
        hasDetailData: false
      });
    }

    return NextResponse.json({
      success: true,
      id: productId,
      message: '상품이 성공적으로 생성되었습니다.',
      hasEnhancedFeatures: !!(pricingData || descriptionImageUrl || additionalImages?.length)
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}