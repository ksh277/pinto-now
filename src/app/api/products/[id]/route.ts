import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getPricingByProductId, hasAdvancedPricing } from '@/lib/pricing-data';
import { verifyRequestAuth } from '@/lib/auth/jwt';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 기본 상품 정보 조회 (UTF8 인코딩 보장)
    const sql = `
      SELECT
        id,
        CONVERT(name USING utf8mb4) as name_ko,
        CONVERT(name USING utf8mb4) as name_en,
        CONVERT(description USING utf8mb4) as description_ko,
        CONVERT(description USING utf8mb4) as description_en,
        thumbnail_url as imageUrl,
        category_id as categoryId,
        price as priceKrw,
        stock as stockQuantity,
        status,
        created_at as createdAt,
        updated_at as updatedAt,
        description_detail
      FROM products
      WHERE id = ? AND status != 'DELETED' AND status != 'HIDDEN'
    `;

    const results = await query(sql, [id]) as any[];

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const row = results[0];

    // 기본 제품 정보 구성
    let product = {
      id: row.id.toString(),
      nameKo: row.name_ko || `상품 ${id}`,
      nameEn: row.name_en || `Product ${id}`,
      descriptionKo: row.description_ko || '',
      descriptionEn: row.description_en || '',
      imageUrl: row.imageUrl || "/components/img/placeholder-product.jpg",
      categoryId: row.categoryId?.toString() || '1',
      subcategory: '',
      isPublished: true,
      isFeatured: false,
      status: row.status || 'ACTIVE',
      stockQuantity: row.stockQuantity || 999,
      priceKrw: row.priceKrw || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      pricingData: null,
      descriptionImageUrl: null,
      additionalImages: []
    };

    // 아크릴 상품들 (1-9)에 대해서는 pricing-data.ts의 데이터를 먼저 확인
    let legacyPricingData = null;
    if (hasAdvancedPricing(id)) {
      legacyPricingData = getPricingByProductId(id);
    }

    // description_detail 필드에서 상세 데이터 파싱
    let detailData: any = null;

    if (row.description_detail) {
      // description_detail은 이미 객체로 파싱되어 있음
      detailData = row.description_detail;
    }

    // product_details 테이블에서도 추가 데이터 조회 (있다면)
    try {
      const detailSql = `
        SELECT detail_data
        FROM product_details
        WHERE product_id = ?
      `;

      const detailResults = await query(detailSql, [id]) as any[];

      if (detailResults.length > 0 && detailResults[0].detail_data) {
        const productDetailsData = JSON.parse(detailResults[0].detail_data);
        // product_details의 데이터를 description_detail과 병합
        detailData = {
          ...detailData,
          ...productDetailsData
        };
      }
    } catch (e) {
      console.log('product_details table not available or empty, using description_detail only');
    }

    // 최종 가격 데이터 결정 (product_details 우선, 없으면 legacy)
    let finalPricingData = null;
    if (detailData?.pricingTiers) {
      // detailData 자체가 가격 데이터인 경우
      finalPricingData = detailData;
    } else if (detailData?.pricingData && Object.keys(detailData.pricingData).length > 0) {
      finalPricingData = {
        ...legacyPricingData,
        ...detailData.pricingData
      };
    } else {
      finalPricingData = legacyPricingData;
    }

    // 향상된 데이터 적용
    if (detailData) {
      if (detailData.descriptionImageUrl) {
        product.descriptionImageUrl = detailData.descriptionImageUrl;
      }
      if (detailData.additionalImages && Array.isArray(detailData.additionalImages)) {
        product.additionalImages = detailData.additionalImages;
      }
    }

    if (finalPricingData) {
      product.pricingData = finalPricingData;

      // 기본 가격 업데이트 (가장 저렴한 가격 찾기)
      if (finalPricingData.pricingTiers && finalPricingData.pricingTiers.length > 0) {
        let allPrices: number[] = [];

        // 모든 pricingTier에서 가격 수집
        finalPricingData.pricingTiers.forEach((tier: any) => {
          if (tier.prices && typeof tier.prices === 'object') {
            Object.values(tier.prices).forEach((sizeData: any) => {
              if (typeof sizeData === 'object' && sizeData !== null) {
                // 중첩된 구조 탐색 (single/double, quantity levels 등)
                const extractPrices = (obj: any) => {
                  if (typeof obj === 'number' && obj > 0) {
                    allPrices.push(obj);
                  } else if (typeof obj === 'object' && obj !== null) {
                    Object.values(obj).forEach(extractPrices);
                  }
                };
                extractPrices(sizeData);
              } else if (typeof sizeData === 'number' && sizeData > 0) {
                allPrices.push(sizeData);
              }
            });
          }
        });

        // 기본 가격이 없거나 0이면 최소 가격으로 설정
        if (allPrices.length > 0 && (!product.priceKrw || product.priceKrw === 0)) {
          const minPrice = Math.min(...allPrices);
          product.priceKrw = minPrice;
        }
      }

      // 여전히 가격이 없으면 기본값 설정
      if (!product.priceKrw || product.priceKrw === 0) {
        product.priceKrw = 1000; // 기본 최소 가격
      }
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 관리자 권한 확인
    const authUser = await verifyRequestAuth(request as NextRequest);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();

    // 업데이트할 필드들을 분리
    const productFields: any = {};
    const detailFields: any = {};

    // products 테이블 필드들
    if (body.nameKo !== undefined) productFields.name = body.nameKo;
    if (body.descriptionKo !== undefined) productFields.description = body.descriptionKo;
    if (body.imageUrl !== undefined) productFields.thumbnail_url = body.imageUrl;
    if (body.categoryId !== undefined) productFields.category_id = body.categoryId;
    if (body.stockQuantity !== undefined) productFields.stock = body.stockQuantity;
    if (body.status !== undefined) productFields.status = body.status;

    // product_details 테이블 필드들
    if (body.descriptionImageUrl !== undefined) detailFields.descriptionImageUrl = body.descriptionImageUrl;
    if (body.additionalImages !== undefined) detailFields.additionalImages = body.additionalImages;
    if (body.pricingData !== undefined) detailFields.pricingData = body.pricingData;

    // 가격 업데이트 (pricingData에서 계산)
    if (body.pricingData && body.pricingData.pricingTiers && body.pricingData.pricingTiers.length > 0) {
      const firstTier = body.pricingData.pricingTiers[0];
      if (firstTier.prices && Object.keys(firstTier.prices).length > 0) {
        const prices = Object.values(firstTier.prices).filter((p: any) => typeof p === 'number' && p > 0 && isFinite(p)) as number[];
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          if (minPrice > 0 && isFinite(minPrice)) {
            productFields.price = minPrice;
          }
        }
      }
    }

    // products 테이블 업데이트 (필드가 있는 경우에만)
    if (Object.keys(productFields).length > 0) {
      productFields.updated_at = new Date();

      const setClause = Object.keys(productFields).map(key => `${key} = ?`).join(', ');
      const values = Object.values(productFields);

      const productSql = `UPDATE products SET ${setClause} WHERE id = ?`;
      await query(productSql, [...values, id]);
    }

    // product_details 테이블 업데이트 (필드가 있는 경우에만)
    if (Object.keys(detailFields).length > 0) {
      // 기존 detail_data 조회
      const existingSql = 'SELECT detail_data FROM product_details WHERE product_id = ?';
      const existingResults = await query(existingSql, [id]) as any[];

      let existingData = {};
      if (existingResults.length > 0 && existingResults[0].detail_data) {
        try {
          existingData = JSON.parse(existingResults[0].detail_data);
        } catch (e) {
          console.error('Failed to parse existing detail_data:', e);
        }
      }

      // 기존 데이터와 새 데이터 병합
      const mergedData = {
        ...existingData,
        ...detailFields,
        lastUpdated: new Date().toISOString()
      };

      if (existingResults.length > 0) {
        // 업데이트
        const updateDetailSql = 'UPDATE product_details SET detail_data = ? WHERE product_id = ?';
        await query(updateDetailSql, [JSON.stringify(mergedData), id]);
      } else {
        // 새로 삽입
        const insertDetailSql = 'INSERT INTO product_details (product_id, detail_data) VALUES (?, ?)';
        await query(insertDetailSql, [id, JSON.stringify(mergedData)]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 인증 토큰 확인 (개발 환경에서는 임시로 우회)
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // if (!token) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    // 소프트 삭제 (관리자 API와 일치)
    const sql = `UPDATE products SET status = 'DELETED', updated_at = NOW() WHERE id = ?`;
    await query(sql, [id]);

    return NextResponse.json({
      success: true,
      message: '상품이 성공적으로 삭제되었습니다.'
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}